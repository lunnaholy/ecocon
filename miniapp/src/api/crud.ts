export interface ApiResponse<T> {
  message: string;
  result: string;
  data: T;
}

export default {
  get: async (url: string, params: {[key: string]: any}[] = [], sendAuthorization = true) => {
    let requestUrl = url;
    if (params.length > 0) {
      requestUrl += '?';
      params.forEach((param) => {
        requestUrl += `${param.key}=${param.value}&`;
      });
    }

    const response = await fetch(requestUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(sendAuthorization ? { Authorization: `Bearer ${localStorage.getItem('access_token')}` } : {})
      },
      mode: 'cors'
    });

    // if(response.status == 401 && location.href.indexOf("dashboard") != -1) {
    //   localStorage.removeItem('access_token');
    //   window.location.href = '/';
    // }

    if(response.status >= 500) throw { status: response.status, message: response.statusText };
    if(!response.ok) throw await response.json();

    return response.json();
  },
  post: async (url: string, body: any, sendAuthorization = true, contentType = "application/json") => {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...(contentType !== "auto" ? { 'Content-Type': contentType } : {}),
        ...(sendAuthorization ? { Authorization: `Bearer ${localStorage.getItem('access_token')}` } : {})
      },
      body: contentType === "application/json" ? JSON.stringify(body) : body,
      mode: 'cors'
    });

    // if(response.status == 401 && location.href.indexOf("dashboard") != -1) {
    //   localStorage.removeItem('access_token');
    //   window.location.href = '/';
    // }

    if(response.status >= 500) throw { status: response.status, message: response.statusText };
    if(!response.ok) throw await response.json();

    return response.json();
  },
  put: async (url: string, body: any, sendAuthorization = true) => {
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(sendAuthorization ? { Authorization: `Bearer ${localStorage.getItem('access_token')}` } : {})
      },
      body: JSON.stringify(body),
      mode: 'cors'
    });

    // if(response.status == 401 && location.href.indexOf("dashboard") != -1) {
    //   localStorage.removeItem('access_token');
    //   window.location.href = '/';
    // }

    if(response.status >= 500) throw { status: response.status, message: response.statusText };
    if(!response.ok) throw await response.json();

    return response.json();
  },
  delete: async (url: string, sendAuthorization = true) => {
    const response = await fetch(url, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(sendAuthorization ? { Authorization: `Bearer ${localStorage.getItem('access_token')}` } : {})
      },
      mode: 'cors'
    });

    // if(response.status == 401 && location.href.indexOf("dashboard") != -1) {
    //   localStorage.removeItem('access_token');
    //   window.location.href = '/';
    // }

    if(response.status >= 500) throw { status: response.status, message: response.statusText };
    if(!response.ok) throw await response.json();

    return response.json();
  },
};