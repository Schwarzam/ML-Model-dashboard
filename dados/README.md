### Tests related to the model training


#### We tested multiple combinations of columns and models.


Main tests related to data processing are inside *processingColumns.ipnby*
Main tests related to training models are inside *Testing models.ipnby*

Reuninting all data processing we create the *package* folder, where we do all procedures to process data.

#### When running a model we run first on the table: 

- package.encode_DataFrame -> Function to encoded text columns into numbers (so Machine Learn models can read)
- package.process_dataset.processColumns -> Function to process all columns, remove needed columns, create new combinations of columns.
- package.process_dataset.generate_labels -> Function to get column names for training.
- package.process_dataset.scaleData -> Scale all data from data frame so Machine Learn models can work better on data.

##### All functions are fully documented inside package folder. 
#####The package folder is also used inside the backend.