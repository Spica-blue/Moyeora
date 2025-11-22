import { StyleSheet } from "react-native";

const PostDetailStyle = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // 상단 정보
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  metaAuthor: {
    fontSize: 13,
    color: '#444',
  },
  metaDot: {
    fontSize: 13,
    color: '#aaa',
    marginHorizontal: 4,
  },
  metaDate: {
    fontSize: 12,
    color: '#888',
  },
  divider: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 12,
  },

  // 본문
  content: {
    fontSize: 15,
    color: '#222',
    lineHeight: 22,
  },
  imageList: {
    marginTop: 16,
    gap: 12,
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: 220,
    borderRadius: 8,
    backgroundColor: '#f2f2f2',
  },

  // 수정/삭제 영역 (좋아요 박스 위치 느낌)
  actionBox: {
    marginTop: 24,
    marginBottom: 8,
    paddingVertical: 12,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  actionButton: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  actionText: {
    fontSize: 14,
    color: '#333',
    fontWeight: '600',
  },

  // 댓글 헤더
  commentHeader: {
    marginTop: 24,
    marginBottom: 8,
  },
  commentHeaderText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
  },

  // 댓글 한 개
  commentItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  commentAuthor: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },
  commentDate: {
    fontSize: 11,
    color: '#999',
    marginTop: 2,
    marginBottom: 4,
  },
  commentContent: {
    fontSize: 14,
    color: '#222',
    lineHeight: 20,
  },
  noCommentText: {
    fontSize: 13,
    color: '#999',
    marginTop: 12,
  },

  // 댓글 입력 바
  commentInputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: '#fff',
  },
  commentInput: {
    flex: 1,
    maxHeight: 80,
    paddingVertical: 6,
    paddingHorizontal: 8,
    fontSize: 14,
    color: '#000',
  },
  commentSendButton: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  commentSendText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1976D2',
  },
});

export default PostDetailStyle;