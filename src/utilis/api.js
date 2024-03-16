import axios from 'axios';

const PER_PAGE = 10;

const fetchRepositories = async (username, page) => {
  try {
    const response = await axios.get(
      `https://api.github.com/users/${encodeURIComponent(username)}/repos`,
      {
        params: {
          per_page: PER_PAGE,
          page: page,
          sort: 'updated',
        },
      },
    );
    return {
      repositories: response.data,
      totalPages: Math.ceil(response.headers['x-total-count'] / PER_PAGE),
    };
  } catch (error) {
    if (error.response) {
      if (error.response.status === 404) {
        throw new Error('User not found');
      } else if (
        error.response.status === 403 &&
        error.response.data &&
        error.response.data.message.includes('rate limit exceeded')
      ) {
        throw new Error('API rate limit exceeded');
      } else {
        throw new Error('An error occurred');
      }
    } else {
      throw new Error('Network error');
    }
  }
};

export {fetchRepositories};
