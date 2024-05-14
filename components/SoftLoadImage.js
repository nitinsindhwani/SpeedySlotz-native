import React, { useState } from 'react';
import { View, Image, ActivityIndicator } from 'react-native';

const SoftLoadImage = ({ src, style }) => {
  const [loaded, setLoaded] = useState(false);

  return (
    <View style={{ ...style, justifyContent: 'center', alignItems: 'center' }}>
      <Image 
        source={{ uri: src }} 
        style={{ ...style, opacity: loaded ? 1 : 0 }} 
        onLoad={() => setLoaded(true)}
      />
      {!loaded && <ActivityIndicator size="small" color="#0000ff" />}
    </View>
  );
};

export default SoftLoadImage;
