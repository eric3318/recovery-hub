import { Image, StyleSheet, Text, View } from 'react-native';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Button, Card } from 'react-native-paper';
import { auth } from '../firebase/firebaseSetup';
import { writeToDB } from '../firebase/firestoreHelper';
import { useState } from 'react';

export default function Post({ item }) {
  const { currentUser } = auth;
  const [liked, setLiked] = useState(item.likedBy.includes(currentUser.uid));

  const likeClickHandler = async () => {
    if (item.likedBy.includes(currentUser.uid)) {
      let newLikedArr = item.likedBy.filter((uid) => uid !== currentUser.uid);
      await writeToDB({ ...item, likedBy: newLikedArr }, 'Posts', item.id);
      setLiked(false);
      return;
    }
    await writeToDB(
      { ...item, likedBy: [...item.likedBy, currentUser.uid] },
      'Posts',
      item.id
    );
    setLiked(true);
  };

  return (
    <Card>
      <Card.Content style={styles.cardContent}>
        <View style={styles.upperSection}>
          <View style={styles.userInfo}>
            <Image
              source={require('../assets/icon.png')}
              style={{ width: 50, height: 50 }}
            />
            <View>
              <Text>{item.timestamp}</Text>
              <Text>username</Text>
            </View>
          </View>
          <View style={styles.like}>
            <Button onPress={likeClickHandler}>
              {liked ? (
                <FontAwesome name="heart-o" size={18} color="red" />
              ) : (
                <FontAwesome name="heart-o" size={18} color="black" />
              )}
            </Button>
            <Text>{item.likedBy.length}</Text>
          </View>
        </View>
        <View style={styles.contentSection}>
          <Image
            source={require('../assets/test-image.jpg')}
            style={{ width: '100%', height: 200 }}
          />
          <Text>{item.text}</Text>
        </View>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  cardContent: {
    rowGap: 10,
  },
  upperSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: 6,
  },
  like: {
    alignItems: 'center',
  },
  contentSection: {
    rowGap: 6,
  },
});
