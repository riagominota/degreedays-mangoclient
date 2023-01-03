# Degree Days to mango via mango node client

- Works like a one-shot script to allow scheduling to be done from inside mango. Updates the provided XID with the values required.
- Note if you need to push multiple values, increase your DP cache size to double what is needed to be pushed
- simply call by using
    >`node ddMango.js --xid=DP_XID --user=yourUser --pass=yourPASS [--host=notLocalHost] [--port=not8080] [--bearer=myUsersJWT]`
- If a bearer token is supplied, that will take precedence over the password

    > **THIS IS ONLY A MERE EXAMPLE AND NOT COMPLETE WORKING CODE**