// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract AIModelMarketplace {
    struct Model {
        string name;
        string description;
        uint256 price;
        address payable creator;
        uint8 ratingCount;
        uint256 totalRating;
    }

    Model[] public models;
    mapping(uint256 => mapping(address => bool)) public hasPurchased;

    event ModelListed(uint256 modelId, string name, address creator);
    event ModelPurchased(uint256 modelId, address buyer);
    event ModelRated(uint256 modelId, uint8 rating, address rater);
    
    function listModel(string memory name, string memory description, uint256 price) public {
        require(price > 0, "Price must be greater than zero");
        models.push(Model({
            name: name,
            description: description,
            price: price,
            creator: payable(msg.sender),
            ratingCount: 0,
            totalRating: 0
        }));
        emit ModelListed(models.length - 1, name, msg.sender);
    }

    function purchaseModel(uint256 modelId) public payable {
        require(modelId < models.length, "Model does not exist");
        Model storage model = models[modelId];
        require(msg.value == model.price, "Incorrect payment amount");
        require(!hasPurchased[modelId][msg.sender], "Model already purchased");

        model.creator.transfer(msg.value);
        hasPurchased[modelId][msg.sender] = true;
        emit ModelPurchased(modelId, msg.sender);
    }

    function rateModel(uint256 modelId, uint8 rating) public {
        require(modelId < models.length, "Model does not exist");
        require(hasPurchased[modelId][msg.sender], "You must purchase the model to rate it");
        require(rating > 0 && rating <= 5, "Rating must be between 1 and 5");

        Model storage model = models[modelId];
        model.ratingCount++;
        model.totalRating += rating;

        emit ModelRated(modelId, rating, msg.sender);
    }

    function withdrawFunds() public {
        payable(msg.sender).transfer(address(this).balance);
    }

    function getModelDetails(uint256 modelId) public view returns (
        string memory name,
        string memory description,
        uint256 price,
        address creator,
        uint256 averageRating
    ) {
        require(modelId < models.length, "Model does not exist");
        Model storage model = models[modelId];
        uint256 avgRating = model.ratingCount > 0 ? model.totalRating / model.ratingCount : 0;
        return (model.name, model.description, model.price, model.creator, avgRating);
    }
}
