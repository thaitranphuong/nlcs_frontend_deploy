function Chatbot() {
    return (
        <div>
            <df-messenger
                intent="WELCOME"
                chat-title="Greeting"
                agent-id="fb099a38-67f0-465e-9a78-ca9c29061dc0"
                language-code="vi"
            ></df-messenger>
        </div>
    );
}

export default Chatbot;
