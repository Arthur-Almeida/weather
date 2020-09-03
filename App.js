import React, {useEffect, useState} from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  // KeyboardAvoidingView,
  Platform,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import {fetchLocationId, fetchWeather} from './utils/api';
import getImageForWeather from './utils/getImageForWeather';

import SearchInput from './components/SearchInput';

const App = () => {
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState('');
  const [temperature, setTemperature] = useState(0);
  const [weather, setWeather] = useState(0);

  useEffect(() => handleUpdateLocation('San Francisco'), []);

  useEffect(() => {
    if (!location) {
      return;
    }

    setLoading(true);

    fetchLocationId(location)
      .then((locationId) => fetchWeather(locationId))
      .then(({location, temperature, weather}) => {
        setLoading(false);
        setError(false);
        setLocation(location);
        setTemperature(temperature);
        setWeather(weather);
      })
      .catch((error) => {
        setLoading(false);
        setError(true);
      });
  }, [location]);

  const handleUpdateLocation = (newLocation) => setLocation(newLocation);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <ImageBackground
        source={getImageForWeather(weather)}
        style={styles.imageContainer}
        imageStyle={styles.image}>
        <View style={styles.detailsContainer}>
          <ActivityIndicator animating={loading} color="white" size="large" />
          {!loading && (
            <View>
              {error && (
                <Text style={[styles.smallText, styles.textStyle]}>
                  Could not load weather, please try a different city
                </Text>
              )}

              {!error && (
                <View>
                  <Text style={[styles.largeText, styles.textStyle]}>
                    {location}
                  </Text>
                  <Text style={[styles.smallText, styles.textStyle]}>
                    {weather}
                  </Text>
                  <Text
                    style={[styles.largeText, styles.textStyle]}>{`${Math.round(
                    temperature,
                  )}º`}</Text>
                </View>
              )}

              <SearchInput
                onSubmit={handleUpdateLocation}
                placeholder="Search any city"
              />
            </View>
          )}
        </View>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#34495E',
  },
  imageContainer: {
    flex: 1,
  },
  image: {
    flex: 1,
    width: null,
    height: null,
    resizeMode: 'cover',
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    paddingHorizontal: 20,
  },
  textStyle: {
    textAlign: 'center',
    fontFamily: Platform.OS === 'ios' ? 'AvenirNext-Regular' : 'Roboto',
    color: 'white',
  },
  largeText: {
    fontSize: 44,
  },
  smallText: {
    fontSize: 18,
  },
});

export default App;
