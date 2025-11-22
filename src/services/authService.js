import { auth, db, storage } from "../../firebaseConfig";
import { signOut, deleteUser, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, deleteDoc, getDocs, collection, query, where } from "firebase/firestore";
import { ref, deleteObject } from "firebase/storage";

// 로그인
export const login = (email, password) => {
  return signInWithEmailAndPassword(auth, email.trim(), password);
};

// 로그아웃
export const logout = () => {
  return signOut(auth);
};

// 회원가입
export const signUp = (email, password) => {
  return createUserWithEmailAndPassword(auth, email.trim(), password);
};

// 탈퇴 시: (유저 정보 + 유저가 작성한 게시물 + 첨부 이미지 + 댓글 전체 삭제)
export const deleteAccount = async (uid) => {
  // 1) 유저 게시글 조회
  const q = query(collection(db, "posts"), where("authorId", "==", uid));
  const postSnap = await getDocs(q);

  for (const postDoc of postSnap.docs) {
    const postData = postDoc.data();
    const postId = postDoc.id;

    // --- 이미지 삭제
    const imageUrls = postData.imageUrls || [];
    for (const url of imageUrls) {
      try {
        const imgRef = ref(storage, url);
        await deleteObject(imgRef);
      } catch (err) {
        console.log("이미지 삭제 실패", err);
      }
    }

    // --- 댓글 삭제
    const commentSnap = await getDocs(
      collection(db, "posts", postId, "comments")
    );
    for (const c of commentSnap.docs) {
      await deleteDoc(
        doc(db, "posts", postId, "comments", c.id)
      );
    }

    // --- 게시글 삭제
    await deleteDoc(doc(db, "posts", postId));
  }

  // 2) users 컬렉션 문서 삭제
  await deleteDoc(doc(db, "users", uid));

  // 3) 실제 Auth 삭제 (마지막)
  await deleteUser(auth.currentUser);
};