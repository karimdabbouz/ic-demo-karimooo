myArray=("0" "1" "2" "3" "4" "5" "6" "7" "8" "9" "10" "11" "12" "13" "14" "15" "16" "17" "18" "19")

for i in ${!myArray[@]}; do
    readarray -t data <./image_data/imagedata_$i.txt
    dfx canister --network=ic --identity anonymous call karimooo_backend setNFTImagedata "(vec {$data})"
    sleep 2
done