import React from 'react';
import { useContext } from 'react';
import { TransactionContext } from '../context/TransactionContext';

const Main = () => {
  const {connectWallet,sendTransaction, handleChange, inputFormData} = useContext(TransactionContext);
  
  const handleSubmit=()=>{
    const{addressTo,amount}=inputFormData;
    if(addressTo === "" || amount === ""){//二つの入力フォームのどちらかがからだった場合エラーが発生するようにする
      return ;
    } else{
      sendTransaction();
    }
  };
  return (
    <div className="mainContainer">
      {/* 左側 */}  
      <div className="cryptContainer">
        <h1 className="title">wallet</h1>
        <button type="button">
          <p className="buttonText" onClick={connectWallet}>ウォレット連携</p>  
        </button>
      </div>
      <div className="inputContainer">
        <input type="text" placeholder="アドレス" name="addressTo" onChange={(e) =>handleChange(e, "addressTo")}/>
        <input type="number" placeholder="通過(eth)" name="amount" step="0.0001"/*数値型の指定 */ onChange={(e) =>handleChange(e, "amount")}/>
        <button type="button" onClick={handleSubmit}>送信</button>
      </div>
    </div>
  )
}

export default Main