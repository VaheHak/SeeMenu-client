class Storage {
  static getToken() {
    if (localStorage.getItem('token')) {
      return localStorage.getItem('token');
    }
    return '';
  }

  static setToken(token) {
    if (!token) {
      return;
    }
    localStorage.setItem('token', token);
  }

  static delete() {
    localStorage.removeItem('role');
    localStorage.removeItem('token');
  }

  static roleGet() {
    return localStorage.getItem('role');
  }

  static roleSet(role) {
    localStorage.setItem('role', role);
  }
}

export default Storage;
