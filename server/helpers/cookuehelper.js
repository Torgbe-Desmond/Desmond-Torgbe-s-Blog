function checkCookie(cookieName) {
    let cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].trim();
        if (cookie.indexOf(cookieName + '=') === 0) {
            return true; // Cookie found
        }
    }
    return false; 
}

module.exports = {checkCookie};