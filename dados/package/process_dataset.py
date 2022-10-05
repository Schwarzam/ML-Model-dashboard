from sklearn.preprocessing import StandardScaler
import joblib

import os

def generate_labels(df, target = 'id_fechou'):
    """Generate list with training columns.

    Args:
        df (pd.DataFrame): DataFrame, all columns except the target will be returned
        target (str, optional): Traget column. Defaults to 'id_fechou'.

    Returns:
        tuple(list, str): list with training columns and target
    """    
    train_labels = list(df.columns)
    train_labels.remove(target)
    return train_labels, target


def processColumns(
                df, 
                remove_columns = ['Data_de_criacao', 'ano', 'ID_cliente', 'Codigo_da_oportunidade', 'Gestão da Segurança Pública', 
                 'S_amp_OP_S_amp_OE', 'Transformação Digital', 'Roadmap'], 
                secondary_remove = ['Comissão sobre Parceiros', 'Cybersecurity', 'Gestão da Saúde', 'Treinamentos',
                'Equilíbrio fiscal', 'Concorrentes', 'Gestão da Receita', 'Gestão da Educação', 'Gestão da Segurança Viária', 'ESG',
                'Gestão de operações projetizadas', 'Software', 'Gestão Estratégica', 'Skill_dev', 'Gestão de pessoas',
                'Gestão de Gastos', 'n_solucoes'], 
                create_columns=True):
    
    """Remove selected columns, and add columns if wanted.

    Args:
        df (pd.DataFrame): target dataframe
        remove_columns (list, optional): Columns to remove. Defaults to ['Data_de_criacao', 'ano', 'ID_cliente', 'Codigo_da_oportunidade', 'Gestão da Segurança Pública', 'S_amp_OP_S_amp_OE', 'Transformação Digital', 'Roadmap'].
        create_columns (bool, optional): add columns if wanted. Defaults to True.

    Returns:
        pd.DataFrame: modified DataFrame
    """                 

    if create_columns:
        df["Custo_Total_per_Valor_corrigido2"] = df["Custo_Total"]/df["Valor_corrigido2"]
        df["numero_relacionamentos_convertidos_per_numero_relacionamentos"] = df["numero_relacionamentos_convertidos"]/df["numero_relacionamentos"]
        df["Gestão da Receita_per_Gestão de Gastos"] = df["Gestão da Receita"] + df["Gestão de Gastos"]

    df = df.drop(remove_columns, axis=1)
    df = df.drop(secondary_remove, axis=1)
    return df


def scaleData(df, save=True, useSaved=True):
    """Scale data range using StandardScaler. This functions also saves the scaler so it may be used later.

    Args:
        df (pd.DataFrame): input dataframe to scale
        save (bool, optional): save model. Defaults to True.
        useSaved (bool, optional): load model. Defaults to True.

    Returns:
        np.array: scaled array.
    """    

    if useSaved:
        print("Using saved scaler.")
        try:
            scaler = joblib.load(os.path.join('package/models', 'scaler.model'))
        except: 
            print("Scaler not found, creating a new one.")
            useSaved = False

    if not useSaved:
        scaler = StandardScaler()
        scaler.fit(df)

    if save:
        joblib.dump(scaler, os.path.join('package/models', 'scaler.model'))

    return scaler.transform(df)