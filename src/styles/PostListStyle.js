import { StyleSheet } from "react-native";

const PostListStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // 밝은 배경
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: '700',
    paddingHorizontal: 16,
    paddingVertical: 12,
    color: '#222',
    borderBottomColor: '#e0e0e0',
    borderBottomWidth: 1,
  },
  listContent: {
    paddingHorizontal: 8,
    paddingBottom: 100,
  },
  postRow: {
    flexDirection: 'row',
    paddingVertical: 10,
    paddingHorizontal: 8,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  postMain: {
    flex: 1,
    marginRight: 8,
  },
  postTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#222',
    marginBottom: 4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  metaText: {
    fontSize: 12,
    color: '#777',
  },
  postPreview: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },
  rightArea: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  thumb: {
    width: 46,
    height: 46,
    borderRadius: 8,
    marginBottom: 4,
    backgroundColor: '#eee',
  },
  commentBadge: {
    width: 40,
    height: 46,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  commentCount: {
    color: '#333',
    fontWeight: '700',
    fontSize: 14,
  },
  commentLabel: {
    color: '#777',
    fontSize: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#eaeaea',
    marginLeft: 8,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 90,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#1976d2',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
  },
  fabText: {
    fontSize: 24,
    color: '#fff',
  },
  bottomButtons: {
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 8,
    backgroundColor: '#fafafa',
  },
  bottomButtonWrapper: {
    marginTop: 6,
  },
});

export default PostListStyle;