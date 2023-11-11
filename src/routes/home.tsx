import styled from "styled-components";
import PostTweetForm from "../components/post-tweet-form";
import Tileline from "../components/timeline";
const Home = () => {
	return (
		<Wrapper>
			<PostTweetForm />
			<Tileline />
		</Wrapper>
	);
};

const Wrapper = styled.div`
	display: grid;
	gap: 50px;
	overflow-y: scroll;
	grid-template-rows: 1fr 5fr;
`;

export default Home;
