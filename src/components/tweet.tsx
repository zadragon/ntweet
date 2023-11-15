import { deleteDoc, doc, updateDoc } from "firebase/firestore";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytes,
} from "firebase/storage";
import { useState } from "react";
import styled from "styled-components";
import { auth, db, storage } from "../firebase";
import { ITweet } from "./timeline";

const Tweet = ({ username, photo, tweet, userId, id }: ITweet) => {
  const [modifyMode, setModifyMode] = useState(false);
  const [modifyTweet, setModifyTweet] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const user = auth.currentUser;
  const onDelete = async () => {
    const ok = confirm("정말 삭제 하시겠습니까?");
    if (!ok || user?.uid !== userId) return;
    try {
      await deleteDoc(doc(db, "tweets", id));
      if (photo) {
        const photoRef = ref(storage, `tweets/${user.uid}/${id}`);
        await deleteObject(photoRef);
      }
    } catch (e) {
      console.log(e);
    } finally {
      //
    }
  };

  const onModifyMode = () => {
    setModifyMode(true);
    setModifyTweet(tweet);
  };

  const onModifyChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setModifyTweet(e.target.value);
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;

    if (files && files.length === 1) {
      const maxSize = 2 * 1024 * 1024; //* 2MB 사이즈 제한
      const fileSize = files[0].size; //업로드한 파일용량

      if (fileSize > maxSize) {
        alert("파일용량은 2MB이하로 업로드해주세요");
        setFile(null);
      } else {
        setFile(files[0]);
      }
    }
  };

  const onModifyDone = async () => {
    const user = auth.currentUser;

    const modifyDoc = doc(db, "tweets", id);

    if (!user || tweet === "" || tweet.length > 180) return;

    await updateDoc(modifyDoc, {
      tweet: modifyTweet,
    });
    if (file) {
      const locationRef = ref(storage, `tweets/${user.uid}/${modifyDoc.id}`);
      const result = await uploadBytes(locationRef, file);
      const url = await getDownloadURL(result.ref);
      await updateDoc(modifyDoc, {
        photo: url,
      });
      setModifyTweet("");
      setFile(null);
    }

    setModifyMode(false);
  };

  return (
    <Wrapper>
      <Column>
        <Username>{username}</Username>
        <Payload>{tweet}</Payload>
        {user?.uid == userId ? (
          <>
            <DeleteButton onClick={onDelete}>Delete</DeleteButton>{" "}
            <ModifyButton onClick={onModifyMode}>수정하기</ModifyButton>
          </>
        ) : null}
        {modifyMode ? (
          <div>
            <textarea value={modifyTweet} onChange={onModifyChange}></textarea>
          </div>
        ) : null}
      </Column>
      <Column>
        {photo ? <Photo src={photo} /> : null}
        {modifyMode ? <input type="file" onChange={onFileChange} /> : null}
      </Column>

      {modifyMode ? <button onClick={onModifyDone}>수정완료</button> : null}
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: grid;
  grid-template-columns: 3fr 1fr;
  padding: 20px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  border-radius: 15px;
`;

const Column = styled.div``;

const Photo = styled.img`
  width: 100px;
  height: 100px;
  border-radius: 15px;
`;

const Username = styled.span`
  font-weight: 600;
  font-size: 15px;
`;

const Payload = styled.p`
  margin: 10px 0px;
  font-size: 18px;
`;

const DeleteButton = styled.button`
  background-color: tomato;
  color: #ffffff;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

const ModifyButton = styled.button`
  background-color: rgb(78, 205, 112);
  color: white;
  font-weight: 600;
  border: 0;
  font-size: 12px;
  padding: 5px 10px;
  text-transform: uppercase;
  border-radius: 5px;
  cursor: pointer;
`;

export default Tweet;
