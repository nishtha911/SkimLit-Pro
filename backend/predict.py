import tensorflow as tf

def predict(abstract_text: str, model) -> list[dict]:
    # Splits abstract into sentences by period (strip, filter empty)
    from preprocess import split_sentences
    sentences = split_sentences(abstract_text)
    
    if not sentences:
        return []
        
    total_lines = len(sentences)
    line_numbers = list(range(total_lines))
    
    # One-hot encodes line_number (depth=15) and total_lines (depth=20) using tf.one_hot
    line_numbers_one_hot = tf.one_hot(line_numbers, depth=15)
    total_lines_one_hot = tf.one_hot([total_lines] * total_lines, depth=20) 
    
    # Create model input dict
    model_inputs = {
        "token_input": tf.constant(sentences),
        "char_input": tf.constant(sentences),
        "line_number_input": line_numbers_one_hot,
        "total_lines_input": total_lines_one_hot
    }
    
    # Runs model.predict()
    probs = model.predict(model_inputs)
    
    # Define labels in alphabetical order (sklearn LabelEncoder)
    labels = ["BACKGROUND", "CONCLUSION", "METHODS", "OBJECTIVE", "RESULTS"]
    
    results = []
    for i, prob in enumerate(probs):
        pred_idx = tf.argmax(prob).numpy()
        label = labels[pred_idx]
        confidence = float(prob[pred_idx])
        
        all_scores = {labels[j]: float(prob[j]) for j in range(len(labels))}
        
        results.append({
            "index": i,
            "text": sentences[i],
            "label": label,
            "confidence": confidence,
            "all_scores": all_scores
        })
        
    return results
