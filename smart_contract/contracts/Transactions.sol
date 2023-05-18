//スマートコントラクトの実装
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Transactions{
    //仮想通貨の受け渡しのためのデータ構造
    struct TransferStruct{ //struct=データ構造を決めてあげる(かた)
        address sender;
        address receiver;
        uint amount;//かねのやりとりの量(送料)
    }

    //structの配列を用意する必要がある
    TransferStruct[] transactions;//transactionsという変数

    event Transfer(address from, address receiver, uint amount); //イベント

    function addToBlockChain(address payable receiver, uint amount)public{
        transactions.push(TransferStruct(msg.sender, receiver, amount));//push関数は配列の中にいれていくことができる
        //emitでイベントの呼び出し
        emit Transfer(msg.sender/*(from)*/,receiver,amount);
    }
}

