changeType=$(cat .version-change-type 2>&1);
if [[ "$changeType" == *"No such file or directory"* ]];
  then
    echo "Missing file .version-change-type!"
fi