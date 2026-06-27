function AnswerBox({

    answer,

    setAnswer,

    submitAnswer

}) {

    return (

        <div className="answer-card">

            <h2>Your Answer</h2>

            <textarea

                value={answer}

                onChange={(e)=>setAnswer(e.target.value)}

                placeholder="Type your answer here..."

                rows="8"

            />

            <br />

            <button

                className="submit-btn"

                onClick={submitAnswer}

            >

                Submit Answer

            </button>

        </div>

    );

}

export default AnswerBox;

