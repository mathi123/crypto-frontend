export class Config {
    static EMAIL_REGEX = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    static PASSWORD_LENGTH = 4;
    /* Used by time-out in ms -> useful for showing the spinner as good UX ( the server is sometimes TO fast :-) */
    static API_CALL_TIMEOUT = 1500;
}
