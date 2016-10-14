pgrep -q mongod
if [[ $? -ne 0 ]]; then
    echo -e "\nMongo doesn't appear to running. [c]ontinue, [s]tart Mongo or bail \n(if you choose start you can use screen -r Mongo to attach to the console)"
    read -n 1 RESPONSE;

    if [ "$RESPONSE" == "s" ]; then
       sudo screen -dm -S Mongo mongod
       sleep 2
    elif [ "$RESPONSE" != "c" ]; then
      exit 0;
    fi
fi
echo "MongoDB is running..."
echo "Launch Node server..."
node index.js
