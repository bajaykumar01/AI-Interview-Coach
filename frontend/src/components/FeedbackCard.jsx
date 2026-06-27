function FeedbackCard({

    score,

    feedback

}) {

    if (!feedback) {

        return null;

    }

    return (

        <div className="feedback-card">

            <h2>AI Evaluation</h2>

            <h3>⭐ Score : {score} / 5</h3>

            <p>{feedback}</p>

        </div>

    );

}

export default FeedbackCard;
