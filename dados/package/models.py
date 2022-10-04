from sklearn.metrics import accuracy_score, classification_report
from xgboost import XGBClassifier
from sklearn.metrics import mean_squared_error

import warnings
warnings.filterwarnings("ignore")

def run_analysis(predicted : list, y : list):
    """Method to run simple analysis on predicted data

    Args:
        predicted (np.array, list): predictions
        y (np.array, list): true values. 
    """    
    acc = accuracy_score(y, predicted)
    print(classification_report(y, predicted))
    print('Acc score: ', acc)
    print('Mean Squared Error: ', mean_squared_error(y, predicted))
    print('\n\n')

def convertPredicted(pred : list, threshold : int = 0.5):
    """Convert a list of predicted probabilities into 0 and 1 depending on the threshold.

    You may also pass a list to create a double threshold. Numbers under the first element are 0. Bigger than the second element 1 and betwen both 2. 

    Args:
        pred (_type_): _description_
        threshold (float, list): if flot if will be a simple threshold, if a list of two elements it creates two thresholds. Defaults to 0.5.

    Returns:
        list: converted predictions into integers
    """    
    ypred = []
    if isinstance(threshold, float) or isinstance(threshold, int):
        for i in pred:
            if i > threshold:
                ypred.append(1)
            else:
                ypred.append(0)
                
    elif isinstance(threshold, list):
        if len(threshold) == 2:
            for i in pred:
                if i < threshold[0]:
                    ypred.append(0)
                elif i > threshold[1]:
                    ypred.append(1)
                else:
                    ypred.append(2)
    
    return ypred

def run_XGB(X_train, X_test, y_train, y_test, max_depth=2, gamma=0.3, eta=0.5, reg_alpha=0.5, reg_lambda=0.7, prints=False):
    if prints:
        print("Running XGB model.")

    model = XGBClassifier(
        max_depth=max_depth,
        gamma=gamma,
        eta=eta,
        reg_alpha=reg_alpha,
        reg_lambda=reg_lambda
    )

    model.fit(X_train, y_train)
    
    pred = model.predict(X_test)
    acc = accuracy_score(pred, y_test)

    if prints:
        print(classification_report(pred, y_test))
        print('accuracy_score: ', acc)
        print('\n\n')
    
    return model, acc 