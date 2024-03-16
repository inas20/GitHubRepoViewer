
# Github Repo Viewer

GitHub Repo Viewer is a simple React Native application that allows users to search for a GitHub user's repositories and filter them by language or stars count

## Features
   Search for a GitHub user's repositories
   Filter repositories by language or stars count
   Select individual repositories
   Pagination to load more repositories
   Refresh the list of repositories

## Geting Started
1.Clone this repository:

   ```bash
   git clone [https://github.com/inas20/GitHubRepoViewer.git]
```

## Step 2: Install dependencies:
```bash
# using npm
npm install

# OR using Yarn
yarn 
```

## Step 3: Run Application:

Let Metro Bundler run in its _own_ terminal. Open a _new_ terminal from the _root_ of your React Native project. Run the following command to start your _Android_ or _iOS_ app:

### For Android

```bash
# using npm
npm run android

# OR using Yarn
yarn android
```

### For iOS

```bash
# using npm
npm run ios

# OR using Yarn
yarn ios
```


## Usage

1. Enter a GitHub username in the input field and press the search button to fetch the user's repositories.
2. Select individual repositories by tapping on them. The selected repositories will be highlighted with a different background color.
3. Filter the list of repositories by selecting an option from the dropdown picker and entering a filter value.
4. Scroll to the end of the list to load more repositories.
5. Pull down the list to refresh it.
   
## Technologies Used:



- React Native
- GitHub API
- DropDownPicker (third-party package)

