import { PostValue } from '../interfaces';

export function newPostId(posts: PostValue[]) {
	let newId = 1;
	posts.forEach((post) => {
		if (post.id >= newId) newId = post.id + 1;
	});
	return newId;
}

export function isPostEmpty(post:PostValue[] | {}) {
	return Object.values(post).filter(prop => !!prop).length===0;
	//return JSON.stringify(post) === '{}';
}
