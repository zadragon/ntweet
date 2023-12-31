import { Unsubscribe, updateProfile } from "firebase/auth";
import { collection, limit, onSnapshot, orderBy, query, where } from "firebase/firestore";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { ITweet } from "../components/timeline";
import Tweet from "../components/tweet";
import { auth, db, storage } from "../firebase";

const Profile = () => {
	const user = auth.currentUser;
	const [avatar, setAvatar] = useState(user?.photoURL);
	const [tweets, setTweets] = useState<ITweet[]>([]);
	const [nickChangeMode, setNickChangeMode] = useState(false);
	const [nickname, setNickname] = useState("");
	let unsubscribe: Unsubscribe | null = null;

	const onAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
		const { files } = e.target;
		if (!user) return;
		if (files && files.length === 1) {
			const file = files[0];
			const locationRef = ref(storage, `avatars/${user?.uid}`);
			const result = await uploadBytes(locationRef, file);
			const avatarUrl = await getDownloadURL(result.ref);
			setAvatar(avatarUrl);
			await updateProfile(user, {
				photoURL: avatarUrl,
			});
		}
	};
	const onNickChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNickname(e.target.value);
	};

	const onNickSubmit = async () => {
		if (user !== null) {
			await updateProfile(user, {
				displayName: nickname,
			})
				.then(() => {
					setNickname("");
					setNickChangeMode(false);
				})
				.catch((error) => {
					console.log(error);
				});
		}
	};

	const fetchTweets = async () => {
		const tweetQuery = query(collection(db, "tweets"), where("userId", "==", user?.uid), orderBy("createdAt", "desc"), limit(25));
		unsubscribe = await onSnapshot(tweetQuery, (snapshot) => {
			const tweets = snapshot.docs.map((doc) => {
				const { tweet, createdAt, userId, usename, photo } = doc.data();
				return {
					tweet,
					createdAt,
					userId,
					usename,
					photo,
					id: doc.id,
				};
			});
			setTweets(tweets);
		});
	};
	useEffect(() => {
		fetchTweets();
		return () => {
			unsubscribe && unsubscribe();
		};
	}, []);

	return (
		<Wrapper>
			<AvatarUpload htmlFor="avatar">
				{avatar ? (
					<AvatarImg src={avatar} />
				) : (
					<svg fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
						<path d="M10 8a3 3 0 100-6 3 3 0 000 6zM3.465 14.493a1.23 1.23 0 00.41 1.412A9.957 9.957 0 0010 18c2.31 0 4.438-.784 6.131-2.1.43-.333.604-.903.408-1.41a7.002 7.002 0 00-13.074.003z" />
					</svg>
				)}
			</AvatarUpload>
			<AvatarInput onChange={onAvatarChange} type="file" id="avatar" accept="image/*" />
			<Name>
				<div>{user?.displayName ?? "이름없음"} </div>
				<div>
					{!nickChangeMode && (
						<button type="button" onClick={() => setNickChangeMode(!nickChangeMode)}>
							닉네임 변경하기
						</button>
					)}
				</div>
				{nickChangeMode ? (
					<>
						<input type="text" placeholder="변경할 닉네임을 입력하세요." onChange={onNickChange} value={nickname} />
						<button onClick={onNickSubmit}>변경</button>
						<button onClick={() => setNickChangeMode(!nickChangeMode)}>취소</button>
					</>
				) : null}
			</Name>
			<Tweets>
				{tweets.map((tweet) => (
					<Tweet key={tweet.id} {...tweet} />
				))}
			</Tweets>
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
const Tweets = styled.div`
	display: flex;
	width: 100%;
	flex-direction: column;
	gap: 10px;
`;
const AvatarImg = styled.img`
	width: 100%;
`;
const AvatarInput = styled.input`
	display: none;
`;
const Name = styled.span`
	font-size: 22px;
	text-align: center;
`;

export default Profile;
