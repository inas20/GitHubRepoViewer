/* eslint-disable prettier/prettier */
import React, { useState, useEffect, useCallback, useDeferredValue } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  RefreshControl,
  ActivityIndicator,
  Alert,
  SafeAreaView,
} from 'react-native';
import { Header } from './src/components/Header';
import { AppButton } from './src/components/Button';
import DropDownPicker from 'react-native-dropdown-picker';
import { fetchRepositories } from './src/utilis/api';

const App = () => {
  const [username, setUsername] = useState('');
  const [repositories, setRepositories] = useState([]);
  const [selectedRepositories, setSelectedRepositories] = useState([]);
  const [filterType, setFilterType] = useState('');
  const [filterValue, setFilterValue] = useState('');
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [pickernOpen, setPickerOpen] = useState(false);
  const [totalPages, setTotalPages] = useState(0);

  const reposPerPage = 10;
  const deferredRepos = useDeferredValue(repositories);

  useEffect(() => {
    if (username) {
      fetchData();
    }
  }, [username, page]);


  // fetch repositories when username change

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setRefreshing(false);
      const { repositories: fetchedRepositories, totalPages: fetchedTotalPages } = await fetchRepositories(username, page);
      setRepositories(fetchedRepositories);
      setTotalPages(fetchedTotalPages);
      setLoading(false);
    } catch (error) {
      Alert.alert(error?.message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  }, [username, page]);



  // when select repositry by pressing in it

  const handleSelectRepository = (repository: { id: any; }) => {
    const isSelected = selectedRepositories.includes(repository.id);
    if (isSelected) {
      setSelectedRepositories(
        selectedRepositories.filter((id) => id !== repository.id)
      );
    } else {
      setSelectedRepositories([...selectedRepositories, repository.id]);
    }
  };

  // render repositry item
  const renderRepository = ({ item }) => {
    const isSelected = selectedRepositories.includes(item.id);
    return (
      <TouchableOpacity
        style={[styles.repository, isSelected && styles.selectedRepository]}
        onPress={() => handleSelectRepository(item)}
      >
        <View style={styles.checkboxContainer}>
          <TouchableOpacity
            style={[
              styles.checkbox,
              isSelected && styles.selectedCheckbox,
            ]}
            onPress={() => handleSelectRepository(item)}
          >
            {isSelected && <View style={styles.selectedCheckboxIcon} />}
          </TouchableOpacity>
        </View>
        <View style={styles.repositoryInfo}>
          <Text style={styles.repositoryName}>{item.name}</Text>
          <Text style={styles.repositoryDescription}>{item.description}</Text>
          <Text style={styles.repositoryLanguage}>{item.language}</Text>
          <Text style={styles.repositoryStars}>
            Stars: {item.stargazers_count}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  // handle when load more when reacgh at the end of list
  const handleLoadMore = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  //handle refresh list when pull down screen
  const handleRefresh = () => {
    setRefreshing(true);
    setPage(1);
    fetchData();
   
  };

  // clear selected repoos
  const clearSelectedRepositories = () => {
    setSelectedRepositories([]);
  };

  const copySelectedRepositories = () => {
    const repositoriesString = selectedRepositories.join(', ');
    if (selectedRepositories?.length > 0) {
      Alert.alert(
        'Copied to clipboard',
        `Selected repositories: ${repositoriesString}`,
        [
          {
            text: 'OK',
          },
        ],
        { cancelable: false }
      );
    } else {
      Alert.alert(
        'Error',
        'There aren\'t any selected repository',
        [
          {
            text: 'OK',
          },
        ],
        { cancelable: false }
      );
    }

  };

  const handleFilterChange = (cb: () => any) => {
    const value = cb();
    if (value === filterType) {
      setFilterType('');
      setFilterValue('');
    } else {
      setFilterType(value);
      setFilterValue('');
    }

  };

  // handle filter repos by language or stars count
  const filterRepositories = (repos: any[]) => {
    if (!filterType || !filterValue) {
      return repos;
    }
    if (filterType === 'Language') {
      return repos.filter((repo: { language: string; }) => repo.language === filterValue);
    } else if (filterType === 'Stars') {
      return repos.filter((repo: { stargazers_count: number; }) => repo.stargazers_count >= parseInt(filterValue, 10));
    } else {
      return repos;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header />
      <View style={styles.subContainer}>
        <View style={styles.header}>
          <TextInput
            style={styles.input}
            value={username}
            onChangeText={setUsername}
            placeholder="Enter a GitHub username"
          />
          <AppButton label={'Search'} onPress={fetchData} disabled={false} />
        </View>
        <ActivityIndicator
          style={styles.loadingIndicator}
          animating={loading}
          size="large"
        />
        {repositories?.length > 0 && <Text style={styles.filterLabel}>Filter by:</Text>}
        {repositories?.length > 0 && <View style={styles.filterContainer}>

            <DropDownPicker
              items={[
                // { label: 'Select an option', value: '' },
                { label: 'Stars', value: 'Stars' },
                { label: 'Language', value: 'Language' },
              ]}
              value={filterType}
              setValue={handleFilterChange}
              open={pickernOpen}
              setOpen={setPickerOpen}
              placeholder={'Select a filter'}
              containerStyle={[styles.pickerStyles, { marginBottom: pickernOpen ? 84 : 10 }]}
              style={styles.pickerItemStyles}
              dropDownStyle={[styles.pickerDropdownStyles]}
            />

          {filterType && <TextInput
            style={styles.filterInput}
            value={filterValue?.toString()}
            onChangeText={setFilterValue}
            placeholder={filterType === 'Language' ? 'Enter a language' : 'Enter a star count'}
          />}

        </View>}
        {deferredRepos ?.length  == 0 && username?.length > 0 && <Text style={styles.error}>No repositories found with this username</Text>}
        <FlatList
          style={styles.listContainer}
          showsVerticalScrollIndicator={false}
          data={filterRepositories(deferredRepos)}
          renderItem={renderRepository}
          keyExtractor={(item) => Math.random()?.toString() + item?.created_at.toString()}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
            />
          }
        />
        <View style={styles.footer}>
          <Text style={styles.pageInfo}>Page {page} of {repositories.length === 0 ? 1 : Math.ceil(repositories.length / reposPerPage)}</Text>
          <AppButton style={styles.footerButton} disabled={selectedRepositories?.length === 0} label={'Clear Selected'} onPress={clearSelectedRepositories} />
          <AppButton style={styles.footerButton} label={'Copy Selected'} onPress={copySelectedRepositories} disabled={undefined} />
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subContainer: { flex: 1, paddingHorizontal: 20 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  input: {
    height: 40,
    borderColor: '#C67889',
    borderWidth: 1,
    paddingHorizontal: 10,
    borderRadius: 10,
    flex: 1,
  },
  button: {
    backgroundColor: '#C67889',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  listContainer: {
    paddingVertical: 10,
  },
  loadingIndicator: {
    // marginVertical: 20,
  },
  repository: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    padding: 10,
    borderRadius: 5,
    borderColor: 'gray',
    borderWidth: 1,
  },
  selectedRepository: {
    backgroundColor: '#ddd',
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: 'gray',
    justifyContent: 'center',
    alignItems: 'center',
  },
  error:{
    color:'red',
    textAlign:'center',
  },
  selectedCheckbox: {
    backgroundColor: '#C67889',
    borderColor: '#C67889',
  },
  selectedCheckboxIcon: {
    width: 12,
    height: 12,
    borderRadius: 2,
    backgroundColor: '#C67889',
  },
  repositoryInfo: {
    flex: 1,
  },
  repositoryName: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  repositoryDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 5,
  },
  repositoryLanguage: {
    fontSize: 12,
    color: '#999',
  },
  repositoryStars: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 10,
  },
  pageInfo: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  footerButton: {
    width: '38%', height: 37, paddingVertical: 0,
    paddingHorizontal: 3,
  },
  filterLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    marginRight: 10,
  },
  filterInput: {
    height: 51,
    width: '45%',
    borderColor: '#C67889',
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    marginLeft: 12,
    alignSelf: 'center',
  },
  filterContainer: {
    flexDirection: 'row',
    //alignItems: 'center',
    marginBottom: 20,
  },
  pickerStyles: {
    //height: 20,
    marginVertical: 8,
    width: '50%',
  },
  pickerItemStyles: {
    justifyContent: 'flex-start',
    borderColor: '#C67889',
    //height: 40,
  },
  pickerDropdownStyles: {
    borderWidth: 1,
    borderColor: '#C67889',
    borderRadius: 8,
  },
});



export default App;
