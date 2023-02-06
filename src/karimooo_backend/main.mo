import Text "mo:base/Text";
import Principal "mo:base/Principal";
import TrieMap "mo:base/TrieMap";
import Blob "mo:base/Blob";
import Nat "mo:base/Nat";
import Nat8 "mo:base/Nat8";
import Nat16 "mo:base/Nat16";
import Nat32 "mo:base/Nat32";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Buffer "mo:base/Buffer";
import Char "mo:base/Char";
import Result "mo:base/Result";
import Debug "mo:base/Debug";

import AID "./AccountIdentifier";


shared(init_msg) actor class Main() {

    // Set owner of canister to installer
    let owner = init_msg.caller;

    // Import NFT canister
    let erc721 = actor "t72s3-jiaaa-aaaai-abtbq-cai" : actor {
        mintNFT : ({metadata: Blob; to: {#principal : Principal; #address: Text}}) -> async Nat32;
        getRegistry : () -> async [(Nat32, Text)];
        getTokens : () -> async [(Nat32, {#fungible: {decimals: Nat8; metadata: ?[Nat8]; name: Text; symbol: Text}; #nonfungible: {metadata: ?[Nat8]}})];
    };


    //////////////////////
    //// Types | Later: import types from types.mo
    /////////////////////

    public type UserID = Principal;

    public type Profile = {
        username: Text;
        profileImage: ?Blob;
        hasDonatedData: Bool;
    };


    // //////////////////
    // State
    // //////////////////

    stable var userDBArray : [(UserID, Profile)] = [];
    stable var usernameDBArray : [(Text, UserID)] = []; // There's probably a better way to keep track of usernames
    stable var imageDBArray : [(UserID, Nat)] = [];
    stable var nftImageDataStable : [Nat8] = [];
    // stable var defaultProfileImageStable : [Nat8] = [];
    private stable var imageID : Nat = 0;

    // Writes stable Array to non-stable object stores after upgrading
    private func instantiateObjectStores() : (TrieMap.TrieMap<UserID, Profile>, TrieMap.TrieMap<Text, Principal>, TrieMap.TrieMap<UserID, Nat>) {
        let userDB = TrieMap.TrieMap<UserID, Profile>(Principal.equal, Principal.hash);
        let usernameDB = TrieMap.TrieMap<Text, Principal>(Text.equal, Text.hash);
        let imageDB = TrieMap.TrieMap<UserID, Nat>(Principal.equal, Principal.hash);
        for (entry in userDBArray.vals()) {
            let newData : Profile = {
                username = entry.1.username;
                profileImage = entry.1.profileImage;
                hasDonatedData = entry.1.hasDonatedData;
            };
            userDB.put(entry.0, newData);
        };
        for (entry in usernameDBArray.vals()) {
            let newData : Principal = entry.1;
            usernameDB.put(entry.0, newData);
        };
        for (entry in imageDBArray.vals()) {
            imageDB.put(entry.0, entry.1);
        };
        return (userDB, usernameDB, imageDB);
    };

    // Writes stable Array to non-stable Buffer after upgrading
    private func instantiateBuffer() : Buffer.Buffer<Nat8> {
        let nftImageData : Buffer.Buffer<Nat8> = Buffer.fromArray(nftImageDataStable);
        // let defaultProfileImage : Buffer.Buffer<Nat8> = Buffer.fromArray(defaultProfileImageStable);
        return nftImageData;
    };

    let (userDB, usernameDB, imageDB) = instantiateObjectStores();
    let nftImageData = instantiateBuffer();

    system func preupgrade() {
        nftImageDataStable := nftImageData.toArray();
        // defaultProfileImageStable := defaultProfileImage.toArray();
        userDBArray := Iter.toArray(userDB.entries());
        usernameDBArray := Iter.toArray(usernameDB.entries());
        imageDBArray := Iter.toArray(imageDB.entries());
    };

    system func postupgrade() {
        userDBArray := [];
        usernameDBArray := [];
        imageDBArray := [];
        nftImageDataStable := [];
        // defaultProfileImageStable := [];
    };


    // /////////////////////
    // ADMIN FUNCTION
    ///////////////////////


    // Sets image data for NFT
    public shared(msg) func setNFTImagedata(data: [Nat8]) : async Result.Result<Text, Text> {
        // assert (msg.caller == owner);
        for (elem in data.vals()) {
            nftImageData.add(elem);
        };
        return #ok("NFT image data set.")
    };


    // /////////////////////////
    // Update Functions
    // ////////////////////////


    public shared(msg) func updateProfileData(user: UserID, username: Text, imageData: ?Blob) : async Text {
        assert (Principal.toText(msg.caller) != "2vxsx-fae");

        let isDataComplete : Bool = switch (imageData) {
            case (null) { false };
            case (_) { true };
        };

        let entry = userDB.get(user);
        switch (entry) {
            case (null) { // user does not yet exist
                // check if username is taken
                let usernameEntry = usernameDB.get(username);
                switch usernameEntry {
                    case null { // username not yet taken
                        let profileData : Profile = {
                            username = username;
                            profileImage = imageData;
                            hasDonatedData = isDataComplete;
                        };
                        usernameDB.put(username, user);
                        userDB.put(user, profileData);
                        return "profile created";
                    };
                    case (?usernameExists) { // username is already taken
                        return "username already exists";
                    };
                };
            };
            case (?item) { // user already exists. update profile
                let usernameEntry = usernameDB.get(username);
                switch usernameEntry {
                    case null { // username not yet taken
                        let profileData : Profile = {
                            username = username;
                            profileImage = imageData;
                            hasDonatedData = isDataComplete;
                        };
                        usernameDB.delete(item.username);
                        usernameDB.put(username, user);
                        userDB.put(user, profileData);
                        return "profile updated. username changed successfully";
                    };
                    case (?usernameEntry) { // username is already taken
                        // check if username is taken by msg.caller
                        if (usernameEntry == msg.caller) { // username is owned by msg.caller
                            let profileData: Profile = {
                                username = username;
                                profileImage = imageData;
                                hasDonatedData = isDataComplete;
                            };
                            userDB.put(user, profileData);
                            return "profile updated. no change in username";
                        } else {
                            return "username already exists";
                        };
                    };
                };
            };

        };
    };



    // THIS BULLSHIT! EVERYTIME A CHINESE BUILDS A FUNCTION MONGOLIAN COME AND DONT LOAD DEFAULT IMAGE FORM FORNTEND!!!

    // public shared(msg) func updateProfileData(user: UserID, username: Text, imageDataArg: ?Blob) : async Text {
    //     assert (Principal.toText(msg.caller) != "2vxsx-fae");


    //     let imageData : Blob = switch (imageDataArg) {
    //         case (null) { Blob.fromArray(defaultProfileImage.toArray()) };
    //         case (?item) { item };
    //     };


    //     let entry = userDB.get(user);
    //     switch (entry) {
    //         case (null) { // user does not yet exist
    //             // check if username is taken
    //             let usernameEntry = usernameDB.get(username);
    //             switch usernameEntry {
    //                 case null { // username not yet taken
    //                     let profileData : Profile = {
    //                         username = username;
    //                         profileImage = imageData;
    //                         hasDonatedData = true;
    //                     };
    //                     usernameDB.put(username, user);
    //                     userDB.put(user, profileData);
    //                     return "profile created";
    //                 };
    //                 case (?usernameExists) { // username is already taken
    //                     return "username already exists";
    //                 };
    //             };
    //         };
    //         case (?item) { // user already exists. update profile
    //             let usernameEntry = usernameDB.get(username);
    //             switch usernameEntry {
    //                 case null { // username not yet taken
    //                     let profileData : Profile = {
    //                         username = username;
    //                         profileImage = imageData;
    //                         hasDonatedData = true;
    //                     };
    //                     usernameDB.delete(item.username);
    //                     usernameDB.put(username, user);
    //                     userDB.put(user, profileData);
    //                     return "profile updated. username changed successfully";
    //                 };
    //                 case (?usernameEntry) { // username is already taken
    //                     // check if username is taken by msg.caller
    //                     if (usernameEntry == msg.caller) { // username is owned by msg.caller
    //                         let profileData: Profile = {
    //                             username = username;
    //                             profileImage = imageData;
    //                             hasDonatedData = true;
    //                         };
    //                         userDB.put(user, profileData);
    //                         return "profile updated. no change in username";
    //                     } else {
    //                         return "username already exists";
    //                     };
    //                 };
    //             };
    //         };

    //     };
    // };


    // // OLD ONE:
    // public shared(msg) func updateProfileData(user: UserID, username: Text, imageData: Blob) : async Text {
    //     assert (Principal.toText(msg.caller) != "2vxsx-fae");
    //     let entry = userDB.get(user);
    //     switch entry {
    //         case null { // user does not yet exist
    //             // check if username is taken
    //             let usernameEntry = usernameDB.get(username);
    //             switch usernameEntry {
    //                 case null { // username not taken yet
    //                     let profileData : Profile = {
    //                         username = username;
    //                         profileImage = ?imageData;
    //                         hasDonatedData = true;
    //                     };
    //                     usernameDB.put(username, user);
    //                     userDB.put(user, profileData);
    //                     return "profile created";
    //                 };
    //                 case (?usernameExists) { // username is already taken
    //                     return "username already exists";
    //                 };
    //             };
    //         };
    //         case (?item) { // user already exists. update profile
    //             let usernameEntry = usernameDB.get(username);
    //             switch usernameEntry {
    //                 case null { // username not yet taken
    //                     let profileData : Profile = {
    //                         username = username;
    //                         profileImage = ?imageData;
    //                         hasDonatedData = true;
    //                     };
    //                     usernameDB.delete(item.username);
    //                     usernameDB.put(username, user);
    //                     userDB.put(user, profileData);
    //                     return "profile updated. username changed successfully";
    //                 };
    //                 case (?usernameEntry) { // username is already taken
    //                     // check if username is taken by msg.caller
    //                     if (usernameEntry == msg.caller) { // username is owned by msg.caller
    //                         let profileData: Profile = {
    //                             username = username;
    //                             profileImage = ?imageData;
    //                             hasDonatedData = true;
    //                         };
    //                         userDB.put(user, profileData);
    //                         return "profile updated. no change in username";
    //                     } else {
    //                         return "username already exists";
    //                     };
    //                 };
    //             };
    //         };

    //     };
    // };


    public shared(msg) func mintReward() : async Nat32 {
        assert (msg.caller != Principal.fromText("2vxsx-fae"));
        let receiver = msg.caller;
        let minterVariant = #principal receiver;
        let metadata = Blob.fromArray(nftImageData.toArray());
        let data = {
            metadata = metadata;
            to = minterVariant;
        };
        let response = await erc721.mintNFT(data);
        imageDB.put(msg.caller, imageID);
        imageID += 1;
        return response;
    };



    // //////////////////////////
    // Query Functions
    // //////////////////////////


    public query func getNFTImageID(principal : UserID) : async ?Nat {
        return imageDB.get(principal);
    };


    public query func getNFTImageData() : async [Nat8] {
        return nftImageData.toArray();
    };


    public query func getProfile(id : UserID) : async ?Profile {
        let user = userDB.get(id);
        switch user {
            case null { // user does not exist
                return ?{
                    username = "";
                    profileImage = ?Blob.fromArray([0]);
                    hasDonatedData = false;
                };
            };
            case (?item) {
                return ?item;
            };
        };
    };


    public query func getAllUsers(): async ?[{principal : Principal; username : Text; hasDonatedData : Bool}] {
        let result = Buffer.Buffer<{principal : Principal; username : Text; hasDonatedData : Bool}>(0);
        let keys = userDB.keys();
        for (key in keys) {
            let entry = userDB.get(key);
            switch entry {
                case null {
                    // do nothing | I should probably catch this case somehow...
                };
                case (?item) {
                    let data = {
                        principal = key;
                        username = item.username;
                        hasDonatedData = item.hasDonatedData;
                    };
                    result.add(data);
                };
            };
        };
        return ?result.toArray();
    };


    // /////////////////////////
    // UTILITY FUNCTIONS
    // ////////////////////////


    // Converts imageID of type Nat to type Blob via type Text
    private func natToBlob(imageID : Nat) : Blob {
        return Text.encodeUtf8(Nat.toText(imageID));
    };


    // Converts Blob to type Nat via type Text
    private func blobToNat(metadata : Blob) : ?Nat {
        return textToNat(Text.decodeUtf8(metadata))
    };


    // Helper function used in blobToNat()
    private func textToNat( txt : ?Text) : ?Nat {
        switch txt {
            case null {
                return null;
            };
            case (?item) {
                let chars = item.chars();
                var num : Nat = 0;
                for (v in chars){
                    let charToNum = Nat32.toNat(Char.toNat32(v)-48);
                    assert(charToNum >= 0 and charToNum <= 9);
                    num := num * 10 +  charToNum;          
                };
                return ?num;
            };
        };
    };

    
    // Helper for getNFTMetadata()
    private func findMatchIndex(x: (Nat32, Text), accountIDArg: Text) : Bool {
        return x.1 == accountIDArg;
    };


    // Helper for getNFTMetadata()
    private func findMatchMetadata(x: (Nat32, {#fungible: {decimals: Nat8; metadata: ?[Nat8]; name: Text; symbol: Text}; #nonfungible: {metadata: ?[Nat8]}}), tokenIndexArg: Nat32) : Bool {
        return x.0 == tokenIndexArg;
    };
}