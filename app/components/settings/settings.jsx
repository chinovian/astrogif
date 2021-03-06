import React, { Component, PropTypes } from 'react';
import { ipcRenderer } from 'electron';
import Button from '../buttons/button';
import ButtonGroup from '../buttons/buttonGroup';
import Icon from '../icons/icons';
import Select from '../select/select';
import Shortcut from './shortcut';
import { version } from '../../../package.json';

import styles from './styles.css';

function getCtrlKey() {
  return process.platform === 'darwin' ? 'cmd' : 'ctrl';
}

export default class Settings extends Component {
  componentDidMount() {
    ipcRenderer.send('newHeight', this.el.clientHeight + 20);
  }

  componentWillUnmount() {
    ipcRenderer.send('resetHeight');
  }

  onButtonClickHandler(key, value) {
    this.props.update(key, value);
  }

  onLoginChangeEvent(value) { // eslint-disable-line class-methods-use-this
    ipcRenderer.send('login', value);
  }

  onDropDownChanged(key, event) {
    this.props.update(key, event.target.value);
  }

  getButton(option, value, text, handler) {
    const configValue = this.props.config[option];
    const isActive = configValue === value;
    const onClick = () => {
      this.onButtonClickHandler(option, value);
      if (handler) {
        handler();
      }
    };

    return <Button onClick={onClick} isActive={isActive}>{text}</Button>;
  }

  render() {
    const { config, updateShortCut } = this.props;
    return (<div className={styles.container} ref={el => this.el = el}>
      <h1 className={styles.title}>Settings</h1>
      <button className={`${styles.close} qa-home`} onClick={() => this.props.changePage('home')}>
        <Icon glyph="cross" height="15" width="15" />
      </button>
      <div className={styles.optionContainer}>
        <h2 className={styles.subTitle}>Global search shortcut</h2>
        <div className={styles.shortcut}>
          <Shortcut currentShortcut={config.shortcut} updateShortCut={updateShortCut} />
        </div>
      </div>
      <div className={styles.optionContainer}>
        <h2 className={styles.subTitle}>What to copy</h2>
        <Select className="qa-cp" value={this.props.config.copy} onChange={this.onDropDownChanged.bind(this, 'copy')}>
          <option value="url">Copy the url on enter</option>
          <option value="markdown">Copy the url as markdown on enter</option>
          <option value="urlMarkdown">Copy the url on enter, as markdown on {getCtrlKey()}+enter</option>
        </Select>
      </div>
      <div className={styles.optionContainer}>
        <h2 className={styles.subTitle}>Restrict gif rating to</h2>
        <ButtonGroup className="qa-rat">
          {this.getButton('rating', 'y', 'Y')}
          {this.getButton('rating', 'g', 'G')}
          {this.getButton('rating', 'pg', 'PG')}
          {this.getButton('rating', 'pg-13', 'PG-13')}
          {this.getButton('rating', 'r', 'R')}
        </ButtonGroup>
      </div>
      <div className={styles.optionContainer}>
        <h2 className={styles.subTitle}>Show previews as</h2>
        <ButtonGroup className="qa-prev">
          {this.getButton('preview', 'gif', '.gif')}
          {this.getButton('preview', 'mp4', '.mp4')}
        </ButtonGroup>
      </div>
      <div className={styles.optionContainer}>
        <h2 className={styles.subTitle}>On computer start</h2>
        <ButtonGroup className="qa-str">
          {this.getButton('login', false, 'Do nothing', this.onLoginChangeEvent.bind(this, false))}
          {this.getButton('login', true, 'Load Astrogif', this.onLoginChangeEvent.bind(this, true))}
        </ButtonGroup>
      </div>
      <p className={styles.version}>Current version: v{version}</p>
    </div>);
  }
}

Settings.propTypes = {
  config: PropTypes.object.isRequired,
  changePage: PropTypes.func.isRequired,
  update: PropTypes.func.isRequired,
  updateShortCut: PropTypes.func.isRequired
};
