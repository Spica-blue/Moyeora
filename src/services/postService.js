import { auth, db, storage } from "../../firebaseConfig";
import { addDoc, collection, deleteDoc, doc, getDoc, getDocs, serverTimestamp } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

// 게시글 작성
export const createPost = async (title, content, imageUrls, nickname) => {
  return await addDoc(collection(db, "posts"), {
    title,
    content,
    authorId: auth.currentUser.uid,
    authorName: nickname,
    imageUrls,
    imageUrl: imageUrls[0] || null, // 썸네일
    commentCount: 0,
    createdAt: serverTimestamp(),
  });
};

// 게시글 조회
export const getPost = async (postId) => {
  const snap = await getDoc(doc(db, "posts", postId));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
};

// 게시글 삭제 (이미지 + 댓글 포함)
export const deletePost = async (postId) => {
  const postRef = doc(db, "posts", postId);
  const postSnap = await getDoc(postRef);

  if (!postSnap.exists()) return;

  const data = postSnap.data();

  // --- 이미지 삭제
  const imageUrls = data.imageUrls || [];
  for (const url of imageUrls) {
    try {
      const imgRef = ref(storage, url);
      await deleteObject(imgRef);
    } catch (err) {
      console.log("이미지 삭제 실패", err);
    }
  }

  // --- 댓글 삭제
  const commentsSnap = await getDocs(
    collection(db, "posts", postId, "comments")
  );
  for (const c of commentsSnap.docs) {
    await deleteDoc(doc(db, "posts", postId, "comments", c.id));
  }

  // --- 게시글 삭제
  await deleteDoc(postRef);
};
