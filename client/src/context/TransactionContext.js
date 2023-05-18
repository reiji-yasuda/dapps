//contextフォルダではそれぞれのコンポーネントに直接アクセスできるような処理が書かれている
//UdemyではJsonPpcProviderのところは本当はethersだが何故か使えなかったので変換した
import { ethers } from "ethers";//ether.jsというライブラリ→インストールする必要がある
import {contractABI, contractAddress} from "../utils/connect";
import { createContext, useEffect, useState } from "react";
//window.ethereum==Metamask
//ホームページのボタンな度に連携するためのcontextを書いていく
export const TransactionContext = createContext();//createContext関数をreactから呼び出す
//スマートコントラクトと連携する作業
//スマートコントラクトの取得

const { ethereum }=window;//分割代入(これ以降はethereumだけで使うことができる)

const getSmartContract=()=>{
    const provider = new ethers.providers.Web3Provider(ethereum)//公式ドキュメントに用意されている
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(
        contractAddress,
        contractABI,
        signer
    );
    console.log(provider, signer, transactionContract);
    return transactionContract;
};

export const TransactionProvider =({children})=>{
    //自分のアカウントを格納するための変数 currentAcount
    const [currentAccount,setCurrentAccount]=useState("");
    //フォームの値を格納するための箱
    const[inputFormData, setInputFormData]=useState({
        // 誰に通貨を送るのか
        //HTMLのnameを参照している
        addressTo: "",
        //料金
        amount: "",
    });
    //input属性が多い時にname属性も増えるのでそこの指定を簡単にできるような書き方
    const handleChange=(e/*event*/, name) =>{//reactに関する内容
        setInputFormData((prevInputFormData)=>({//入力された時の値の更新するための記述がこの中に書かれている
            ...prevInputFormData,//スプレッド構文
            [name]: e.target.value,
        }));
    };

    const checkMetamaskWalletConnected=async() =>{
        //メタマスクウォレットと連携できているのかの確認(メタマスクログイン時のパスワード入力によってログインできているかどうか判断する)
        if (!ethereum) return alert("メタマスクをインストールしてください");
        //メタマスクのアカウント持っているならそのメタマスクのアカウントのウィレットIDを取得しよう
        const accounts = await ethereum.request({method: "eth_accounts"});
        console.log(accounts);
        if (accounts.length) {
            setCurrentAccount(accounts[0]);
        } else {
            console.log("アカウントが見つかりませんでした");
        }   
    };

    
    //上記の処理をボタンからできるようにする処理
    //実際に連携を押すことでmetamaskを起動するため記述
    const connectWallet= async ()=>{
        if(!ethereum) return alert("メタマスクをインストールしてください");
        //メタマスクをもっていればアカウントとの接続を開始する。
        const accounts = await ethereum.request({method: "eth_requestAccounts"});
        //自分のアカウントを状態変数として持っておきましょうということ(送るために)
    };

    //実際に通貨のやり取りをする
    const sendTransaction=async () => {
        if(!ethereum) return alert("メタマスクをインストールしてください");//毎回インストールされてなかった時のために確認する
        console.log("sendTransaction");
        const {addressTo,amount}=inputFormData;
        const transactionContract = getSmartContract();//儀式だと思っている
        //イーサで使うために変形してくれるための宣言(ether.jsライブラリ)
        const parsedAmount=ethers.utils.parseEther(amount);
        
        
        //送るための記述(metamaskからとってきたudemyでは)しかし自分がUdemyを受けた時期にはその記述はなくなっていて変な記述になっていたためあまり詳しくわからない
        const txhash=await ethereum.request({
            method: "eth_sendTransaction",//metamask側で決めたメソッド
            params: [
                {//送るためのデータの設定
                    gas: "0x2710",//16進数で設定
                    from: currentAccount,
                    //この二つは入力フォームから取る必要がある
                    to: addressTo ,//ここが参照されない
                    value: parsedAmount._hex,//._/hexで16進数に変換している]
                },
            ],
        });
        const transactionHash = await transactionContract.addToBlockChain(
            addressTo,
            parsedAmount,
        );
        console.log(`ロード中...${transactionHash.hash}`);
        await transactionHash.wait();//waitを呼ばないと下記のlogが出てこない　送金成功した時に出てくる
        console.log(`送金に成功!${transactionHash.hash}`);
    };
    //第二引数が空なので(変数)ページ更新した時に一回だけ情報が更新される
    useEffect(()=>{
        checkMetamaskWalletConnected();
    },[]);
    
    //Main.jsに渡す
    return(
        <TransactionContext.Provider value={{ connectWallet, sendTransaction, handleChange, currentAccount, inputFormData, setInputFormData }}>
            {children}
        </TransactionContext.Provider>
        //childrenはいつでも呼び出すことができるという指定
    );
};