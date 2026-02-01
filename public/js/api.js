
// Get token from localStorage
function getAuthToken() {
    return localStorage.getItem('authToken') || '';
}

export async function fetchApi(api) {
    try {
        const token = getAuthToken();
        const res = await fetch(api, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (res.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = '/html/login.html';
            return;
        }
        
        if (!res.ok) throw new Error(`Failed to fetch ${api}: ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function fetchApiWithId(api, id) {
    try {
        const token = getAuthToken();
        const res = await fetch(`${api}${id}`, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (res.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = '/html/login.html';
            return;
        }
        
        if (!res.ok) throw new Error(`Failed to fetch ${api}: ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error(err);
        throw err;
    }
}

export async function postApi(api, data) {
    try {
        const token = getAuthToken();
        const res = await fetch(api, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        
        if (res.status === 401) {
            localStorage.removeItem('authToken');
            window.location.href = '/html/login.html';
            return;
        }
        
        if (!res.ok) throw new Error(`Failed to post: ${res.status}`);
        return await res.json();
    } catch (err) {
        console.error(err);
        throw err;
    }
}

   export async function postApi (api, data){

     
           try {
              const res = await fetch(api, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
              })
                if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`Failed to post to ${api}: ${res.status} ${text}`);
                }

                const ct = res.headers.get('content-type') || '';
                if (ct.includes('application/json')) {
                    const json = await res.json();
                    console.log('Response from POST:', json);
                    return json;
                } else {
                    const txt = await res.text();
                    console.log('Response from POST (text):', txt);
                    return txt;
                            }

                } catch (err) {
                                console.error(err);
                                throw err;
                }
            }

    export async function patchApi (api, id, data){
              try {
                 const res = await fetch(`${api}${id}`, {
                   method: 'PATCH',
                   headers: {
                       'Content-Type': 'application/json'
                   },
                   body: JSON.stringify(data)
                 })
                 if (!res.ok) {
                    const text = await res.text();
                    throw new Error(`Failed to patch to ${api}: ${res.status} ${text}`);
                 }
                }
                    catch (err) {
                                      console.error(err);
                                        throw err;
                    }
                }