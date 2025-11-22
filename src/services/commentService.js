// services/commentService.js
import { auth, db } from "../../firebaseConfig";
import { addDoc, collection, deleteDoc, doc, serverTimestamp } from "firebase/firestore";

// 댓글 작성
export const createComment = async (postId, text, nickname) => {
  return await addDoc(
    collection(db, "posts", postId, "comments"),
    {
      text,
      authorId: auth.currentUser.uid,
      authorName: nickname,
      createdAt: serverTimestamp(),
    }
  );
};

// 댓글 삭제
export const deleteComment = async (postId, commentId) => {
  return await deleteDoc(
    doc(db, "posts", postId, "comments", commentId)
  );
};
