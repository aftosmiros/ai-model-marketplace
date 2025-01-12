import React, { useState, useEffect } from "react";
import Web3 from "web3";
import "./App.css";
import contractABI from "./abi.json"; // Скопируйте ABI сюда

const contractAddress = "0xa106F7546D53D35766585a9acFfD7f001FCBBc74"; // Адрес вашего контракта

function App() {
    const [account, setAccount] = useState("");
    const [contract, setContract] = useState(null);
    const [models, setModels] = useState([]);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");

    useEffect(() => {
        const init = async () => {
            if (window.ethereum) {
                try {
                    // Подключаем Web3
                    const web3 = new Web3(window.ethereum);
                    await window.ethereum.request({ method: 'eth_requestAccounts' });

                    // Получаем список аккаунтов
                    const accounts = await web3.eth.getAccounts();

                    // Инициализируем контракт
                    const deployedContract = new web3.eth.Contract(contractABI, contractAddress);

                    setAccount(accounts[0]);
                    setContract(deployedContract);

                    console.log("Connected to MetaMask:", accounts[0]);
                } catch (error) {
                    console.error("Error connecting to MetaMask:", error);
                }
            } else {
                alert("MetaMask is not installed! Please install it to use this app.");
            }
        };
        init();
    }, []);

    const listModel = async () => {
        await contract.methods.listModel(name, description, price).send({ from: account });
        alert("Model listed!");
    };

    const fetchModels = async () => {
        const modelsCount = await contract.methods.modelsLength().call();
        const tempModels = [];
        for (let i = 0; i < modelsCount; i++) {
            const model = await contract.methods.models(i).call();
            tempModels.push({ ...model, id: i });
        }
        setModels(tempModels);
    };

    return (
        <div className="App">
            <div className="container">
                <h1>AI Model Marketplace</h1>
                <p>Connected account: {account}</p>

                <div className="form">
                    <h2>List AI Model</h2>
                    <input
                        type="text"
                        placeholder="Model Name"
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        type="text"
                        placeholder="Description"
                        onChange={(e) => setDescription(e.target.value)}
                    />
                    <input
                        type="number"
                        placeholder="Price (Wei)"
                        onChange={(e) => setPrice(e.target.value)}
                    />
                    <button onClick={listModel}>List Model</button>
                </div>

                <div>
                    <h2>Available Models</h2>
                    <button onClick={fetchModels}>Fetch Models</button>
                    <ul>
                        {models.map((model, index) => (
                            <li key={index}>
                                <strong>{model.name}</strong> - {model.price} Wei
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default App;
