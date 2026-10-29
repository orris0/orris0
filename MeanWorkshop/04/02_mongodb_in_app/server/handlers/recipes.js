var db = require("../data/db.js"),
    ObjectId = require('mongodb').ObjectId;

module.exports = {
    get_recipes: function (start, pageSize, callback) {
        db.recipes.find({})
            .skip(start)
            .limit(pageSize)
            .toArray(function (err, recipes) {
                if (err) {
                    return callback({ error: "db_error", message: err.message });
                }
                return callback(null, recipes);
            });
    },

    get_recipe_by_id: function (recipe_id, callback) {
        var query_id;
        try {
            query_id = new ObjectId(recipe_id);
        } catch (e) {
            query_id = recipe_id;
        }

        db.recipes.findOne({ _id: query_id }, function (err, recipe) {
            if (err) {
                return callback({ error: "db_error", message: err.message });
            }
            return callback(null, recipe);
        });
    },

    add_recipe: function (recipe_data, callback) {
        db.recipes.insertOne(recipe_data, function (err, result) {
            if (err) {
                return callback({ error: "db_error", message: err.message });
            }
            var inserted_recipe = result.ops ? result.ops[0] : recipe_data;
            return callback(null, inserted_recipe);
        });
    }
};

