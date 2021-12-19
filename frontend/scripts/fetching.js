
async function fetchPost(url = "", data = {}) {

    return fetch(url, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: new Headers({'Content-Type': 'application/json'}),
    });
} 

window.fetchPost = fetchPost;