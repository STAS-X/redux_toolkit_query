import { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import {
	useGetPostsQuery,
	useAddPostMutation,
	useDeletePostMutation,
} from './redux';
import { PostValue } from './interfaces';
import './App.css';
import { isPostEmpty, newPostId } from './utilites/postUtils';

function App() {
	const [count, setCount] = useState('');
	const [deletePostId, setDeletePostId] = useState(0);
	const [newPost, setNewPost] = useState({});
	const { data: storePosts = [] } = useGetPostsQuery('');

	const {
		data: posts = [],
		isLoading,
		isError,
		error,
	} = useGetPostsQuery(count, {
		refetchOnReconnect: true,
	});

	const [
		addPost,
		{ isLoading: isLoadingPost, error: errorPost, isError: isErrorPost },
	] = useAddPostMutation();
	const [deletePost, { isLoading: isDeletedPost }] = useDeletePostMutation();
  //console.log(useDeletePostMutation(),'delete handle');

	const handleChange = (e: { target: HTMLSelectElement }) => {
		setCount(e.target.value);
	};
	const handleChangePost = (e: React.ChangeEvent<HTMLInputElement>) => {
		setNewPost((post: PostValue) => {
			return { ...post, [e.target.name]: e.target.value };
		});
	};

	const handleAddPost = async () => {
		if (!isPostEmpty(newPost)) {
			await addPost({ ...newPost, id: newPostId(storePosts) }).unwrap();
			setNewPost({});
			//refetch();
		}
	};

	const handleDeletePost =  async (id: number) => {
		if (!isNaN(id)) {
      //console.log('delete id');
      setDeletePostId(id);
			await deletePost(id).unwrap();
		}
		//refetch();
	};

  useEffect(()=>{
    console.log('component is remount');
  },[]);

	if (isLoading || isLoadingPost) return <h3>Загружаются посты...</h3>;
	if (isDeletedPost) return <h3>{`Удаляем пост '${deletePostId}'...`}</h3>;
	if (isErrorPost && errorPost)
		return (
			<h4>{`Error occured ${errorPost? errorPost: 'unknown'}`}</h4>
		);
	if (isError && error) return (
		<h4>{`Error occured ${error? error: 'unknown'}`}</h4>
	);

	return (
		<div className="flex flex-row justify-around">
			<div>
				<select value={count} onChange={handleChange}>
					<option value={''}>Все</option>
					<option value={1}>1</option>
					<option value={2}>2</option>
					<option value={3}>3</option>
				</select>
			</div>
			<div>
				<Form>
					<Form.Group className="mb-3" controlId="formTitle">
						<Form.Label>Добавить новый пост: </Form.Label>
						<Form.Control
							type="input"
							name="title"
							placeholder="Введите название поста"
							onChange={handleChangePost}
						/>
						{/*<Form.Text className="text-muted">наименование поста</Form.Text>*/}
					</Form.Group>
					<Form.Group className="mb-3" controlId="formAuthor">
						<Form.Label>Ник автора: </Form.Label>
						<Form.Control
							type="input"
							name="author"
							placeholder="Введите ник:"
							onChange={handleChangePost}
						/>
						{/*<Form.Text className="text-muted">ник автора поста</Form.Text>*/}
					</Form.Group>
					<Button
						variant="primary"
						disabled={isPostEmpty(newPost)}
						onClick={handleAddPost}
					>
						Добавить пост
					</Button>
				</Form>
			</div>
			<ul className="w-[35%]">
				{posts.map((post: PostValue) => (
					<div
						key={post.id}
						className="flex flex-row justify-content-between nowrap mb-3"
					>
						<li>{`${post.id}. Post title - '${post.title}'`} </li>
						<Button
							variant="danger"
							onClick={() => {
								handleDeletePost(post.id);
							}}
						>
							Удалить
						</Button>
					</div>
				))}
			</ul>
		</div>
	);
}

export default App;
