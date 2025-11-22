import { StyleSheet } from "react-native";

const PostWriteStyle = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },

  /* 헤더 */
  // header: {
  //   height: 48,
  //   flexDirection: 'row',
  //   alignItems: 'center',
  //   paddingHorizontal: 12,
  //   borderBottomWidth: 1,
  //   borderBottomColor: '#eee',
  // },
  // headerLeft: {
  //   fontSize: 20,
  //   width: 40,
  // },
  // headerTitle: {
  //   flex: 1,
  //   textAlign: 'center',
  //   fontSize: 16,
  //   fontWeight: '600',
  // },
  headerRight: {
    fontSize: 14,
    fontWeight: '600',
    color: '#00B894', // 네이버 카페 등록 버튼 느낌의 연두색
  },

  /* 본문 */
  body: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  sectionLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#333',
    marginBottom: 6,
  },
  titleInput: {
    fontSize: 22,
    fontWeight: '600',
    paddingVertical: 6,
  },
  divider: {
    height: 1,
    backgroundColor: '#eee',
    marginBottom: 12,
  },
  contentInput: {
    fontSize: 15,
    minHeight: 180,
    color: '#333',
  },

  /* 이미지 리스트 */
  imageList: {
    marginTop: 16,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 8,
    marginBottom: 8,
    backgroundColor: '#f2f2f2',
  },
  imageHint: {
    fontSize: 12,
    color: '#888',
    marginBottom: 8,
  },

  /* 하단 툴바 */
  toolbar: {
    height: 52,
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    paddingHorizontal: 8,
    backgroundColor: '#fff',
  },
  toolbarButton: {
    width: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toolbarIcon: {
    fontSize: 20,
    color: '#444',
  },
});

export default PostWriteStyle;