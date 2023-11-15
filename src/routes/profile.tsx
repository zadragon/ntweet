import { useState } from "react";
import styled from "styled-components";
import { auth } from "../firebase";

const Profile = () => {
  const user = auth.currentUser;
  const [avatar, setAvatar] = useState(user?.photoURL);
  return (
    <Wrapper>
      <AvatarUpload>
        <AvatarImg />
      </AvatarUpload>
      <AvatarInput type="file" accept="image/*" />
      <Name>{user?.displayName ?? "이름없음"}</Name>
    </Wrapper>
  );
};

const Wrapper = styled.div`
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 20px;
`;
const AvatarUpload = styled.label`
  width: 80px;
  overflow: hidden;
  height: 80px;
  border-radius: 50%;
  background-color: #1d9bf0;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  svg {
    width: 50px;
  }
`;

const AvatarImg = styled.img`
  width: 100%;
`;
const AvatarInput = styled.input`
  display: none;
`;
const Name = styled.span`
  font-size: 22px;
`;

export default Profile;
