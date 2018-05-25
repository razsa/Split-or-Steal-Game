import React, { Component } from "react";
import "../App.css";

class Social extends Component {
  render() {
    let { className } = this.props;
    return (
      <div>
        <span style={{ color: "goldenrod" }}>Contact Us</span>
        <div class={className}>
          <a
            href="https://t.me/splitorsteal"
            title="Telegram"
            target="_blank"
            rel="noopener noreferrer"
            data-slimstat="5"
          >
            <i class="fab fa-telegram fa-2x" />
          </a>
          {"  "}
          <a
            href="https://www.facebook.com/Split-or-Steal-756882654699219/"
            title="Facebook"
            target="_blank"
            rel="noopener noreferrer"
            data-slimstat="5"
          >
            <i class="fab fa-facebook fa-2x" />
          </a>
          {"  "}
          <a
            href="https://twitter.com/whatsInTheName_"
            title="Twitter"
            target="_blank"
            rel="noopener noreferrer"
            data-slimstat="5"
          >
            <i class="fab fa-twitter fa-2x" />
          </a>
          {"  "}
          <a
            href="https://github.com/showmeyourcode/Split-or-Steal-Game"
            title="GitHub"
            target="_blank"
            rel="noopener noreferrer"
            data-slimstat="5"
          >
            <i class="fab fa-github fa-2x" />
          </a>
        </div>
      </div>
    );
  }
}

export default Social;
