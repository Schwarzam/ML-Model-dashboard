from sklearn.metrics import accuracy_score, classification_report
from xgboost import XGBClassifier

def run_XGB(X_train, X_test, y_train, y_test, max_depth=2, gamma=0.3, eta=0.5, reg_alpha=0.5, reg_lambda=0.7):
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
    print(classification_report(pred, y_test))
    
    acc = accuracy_score(pred, y_test)
    print('accuracy_score: ', acc)
    print('\n\n')
    
    return model