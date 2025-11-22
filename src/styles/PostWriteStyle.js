import { StyleSheet } from "react-native";

const PostWriteStyle = StyleSheet.create({
  container: { 
    flex: 1, 
    padding: 16, 
    backgroundColor: '#fff' 
  },
  heading: {
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  imageList: {
    marginBottom: 12,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    marginBottom: 8,
  },
  imageHint: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },
  buttonRow: {
    marginBottom: 8,
  },
});

export default PostWriteStyle;