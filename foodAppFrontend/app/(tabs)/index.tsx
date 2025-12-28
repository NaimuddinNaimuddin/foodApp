import { StyleSheet, Text } from 'react-native';

export default function HomeScreen() {
  return (
    <>
      <Text> This is Home page</Text>
    </>
  );
}

const styles = StyleSheet.create({
  headerImage: {
    color: '#808080',
    bottom: -90,
    left: -35,
    position: 'absolute',
  },
  titleContainer: {
    flexDirection: 'row',
    gap: 8,
  },
});