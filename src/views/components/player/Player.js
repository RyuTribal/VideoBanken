import React, { Component } from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Switch, Route, Link } from "react-router-dom";
import { Auth, Hub, Storage, API, graphqlOperation } from "aws-amplify";
import * as queries from "../../../graphql/queries";
import * as mutations from "../../../graphql/mutations";
import ReactPlayer from "react-player";
import {
  Slider,
  Direction,
  PlayerIcon,
  Button,
  FormattedTime,
} from "react-player-controls-touch";
import IdleTimer from "react-idle-timer";
import { IconButton } from "@material-ui/core";
import {
  PlayArrow,
  Pause,
  Replay,
  VolumeUp,
  VolumeDown,
  VolumeOff,
  Settings,
  Fullscreen,
  FullscreenExit,
} from "@material-ui/icons";

class Player extends Component {
  constructor() {
    super();
    this._isMounted = false;
    this.state = {
      play: true,
      pause: false,
      video: "",
      videoCurrentTime: 0,
      videoDuration: 0,
      videoWatched: 0,
      videoLoaded: 0,
      videoLoadedPercent: 0,
      videoPlayedPercent: 0,
      hoveredTime: 0,
      hoveredPos: 97,
      showTime: false,
      muted: JSON.parse(localStorage.getItem("muted")) || false,
      volumeLevel: localStorage.getItem("volumeLevel") || 1,
      prevVolumeLevel: localStorage.getItem("prevVolumeLevel") || 1,
      fullScreen: false,
      playBackRate: 1,
      pip: false,
      cogOpen: false,
      outsideClicked: false,
      qualityOpen: false,
      speedOpen: false,
      selectedQuality: "auto",
      qualities: ["auto", "360p", "540p", "720p", "1080p"],
      isTimedOut: true,
      mouseOver: false,
      replay: false,
      thumbs: [],
    };
    this.idleTimer = null;
    this.wrapperRef = React.createRef();
  }
  componentDidMount = async () => {
    this._isMounted = true;
    document.addEventListener("fullscreenchange", (event) => {
      if (document.fullscreenElement && this._isMounted) {
        this.setState({ fullScreen: true });
      } else if (!document.fullscreenElement && this._isMounted) {
        this.setState({ fullScreen: false });
      }
    });

    /* Firefox */
    document.addEventListener("mozfullscreenchange", (event) => {
      if (document.fullscreenElement && this._isMounted) {
        this.setState({ fullScreen: true });
      } else {
        if (this._isMounted) {
          this.setState({ fullScreen: false });
        }
      }
    });

    /* Chrome, Safari and Opera */
    document.addEventListener("webkitfullscreenchange", (event) => {
      if (document.fullscreenElement && this._isMounted) {
        this.setState({ fullScreen: true });
      } else {
        if (this._isMounted) {
          this.setState({ fullScreen: false });
        }
      }
    });

    /* IE / Edge */
    document.addEventListener("msfullscreenchange", (event) => {
      if (document.fullscreenElement && this._isMounted) {
        this.setState({ fullScreen: true });
      } else {
        if (this._isMounted) {
          this.setState({ fullScreen: false });
        }
      }
    });
    document.addEventListener("mousedown", this.handleClickOutside);
    this.wrapperRef.current.addEventListener(
      "keydown",
      this.handleVideoShortcuts
    );
  };
  componentDidUpdate = async (prevProps) => {
    if (prevProps.videoID !== this.props.videoID) {
      API.graphql(
        graphqlOperation(queries.getVideoSize, {
          guid: this.props.videoID,
        })
      ).then((res) => {
        if (res.data.getVideoSize.srcHeight === 720) {
          this.setState({ qualities: ["auto", "360p", "540p", "720p"] });
        }
      });
      await this.setQuality();
      if (this.state.thumbs.length === 0) {
        let thumbs = await Storage.vault
          .list("thumbnails/", {
            bucket: "vod-destination-1uukav97fprkq",
            level: "public",
            customPrefix: { public: `${this.props.videoID}/` },
          })
          .then((res) => {
            return res;
          });
        for (let i = 0; i < thumbs.length; i++) {
          await Storage.vault
            .get(thumbs[i].key, {
              bucket: "vod-destination-1uukav97fprkq",
              level: "public",
              customPrefix: { public: `${this.props.videoID}/` },
            })
            .then((res) => {
              const videoDuration = this.player.getDuration();
              this.setState({
                thumbs: [
                  ...this.state.thumbs,
                  {
                    link: res,
                    key: thumbs[i].key,
                    start: (videoDuration / thumbs.length) * i,
                    end: (videoDuration / thumbs.length) * (i + 1),
                    index: i,
                  },
                ],
              });
            });
        }
      }
    }
  };
  componentWillUnmount = () => {
    this._isMounted = false;
    document.removeEventListener("fullscreenchange", (event) => {
      if (document.fullscreenElement) {
        this.setState({ fullScreen: true });
      } else {
        this.setState({ fullScreen: false });
      }
    });
    document.removeEventListener("mozfullscreenchange", (event) => {
      if (document.fullscreenElement) {
        this.setState({ fullScreen: true });
      } else {
        this.setState({ fullScreen: false });
      }
    });
    document.removeEventListener("webkitfullscreenchange", (event) => {
      if (document.fullscreenElement) {
        this.setState({ fullScreen: true });
      } else {
        this.setState({ fullScreen: false });
      }
    });
    document.removeEventListener("msfullscreenchange", (event) => {
      if (document.fullscreenElement) {
        this.setState({ fullScreen: true });
      } else {
        this.setState({ fullScreen: false });
      }
    });
    document.removeEventListener("mousedown", this.handleClickOutside);
    this.wrapperRef.current.removeEventListener(
      "keydown",
      this.handleVideoShortcuts
    );
    clearInterval();
  };
  replaceThumb = async (key, index) => {
    let oldArray = this.state.thumbs;
    const newLink = await Storage.vault
      .get(key, {
        bucket: "vod-destination-1uukav97fprkq",
        level: "public",
        customPrefix: { public: `${this.props.videoID}/` },
      })
      .then((res) => {
        return res;
      });
    oldArray[index].link = newLink;
    this.setState({ thumbs: oldArray });
  };
  setQuality = async () => {
    if (this.state.selectedQuality === "auto") {
      this.setState({
        video: `https://d2pfjxfjra8lmf.cloudfront.net/${this.props.videoID}/hls/${this.props.videoID}.m3u8`,
      });
    } else if (this.state.selectedQuality === "360p") {
      this.setState({
        video: `https://d2pfjxfjra8lmf.cloudfront.net/${this.props.videoID}/hls/${this.props.videoID}_Ott_Hls_Ts_Avc_Aac_16x9_640x360p_30Hz_1.2Mbps_qvbr.m3u8`,
      });
    } else if (this.state.selectedQuality === "540p") {
      this.setState({
        video: `https://d2pfjxfjra8lmf.cloudfront.net/${this.props.videoID}/hls/${this.props.videoID}_Ott_Hls_Ts_Avc_Aac_16x9_960x540p_30Hz_3.5Mbps_qvbr.m3u8`,
      });
    } else if (this.state.selectedQuality === "720p") {
      this.setState({
        video: `https://d2pfjxfjra8lmf.cloudfront.net/${this.props.videoID}/hls/${this.props.videoID}_Ott_Hls_Ts_Avc_Aac_16x9_1280x720p_30Hz_5.0Mbps_qvbr.m3u8`,
      });
    } else if (this.state.selectedQuality === "1080p") {
      this.setState({
        video: `https://d2pfjxfjra8lmf.cloudfront.net/${this.props.videoID}/hls/${this.props.videoID}_Ott_Hls_Ts_Avc_Aac_16x9_1920x1080p_30Hz_8.5Mbps_qvbr.m3u8`,
      });
    }
  };
  handleVideoShortcuts = (event) => {
    const player = this.player.getInternalPlayer();
    switch (event.keyCode) {
      case 70:
        event.stopPropagation();
        event.preventDefault();
        if (this._isMounted) {
          this.setState({ isTimedOut: false });
        }

        this.toggleFullScreen();
        if (this.state.pause !== true && this.state.cogOpen !== true) {
          if (this.state.pause === false && this.state.play === false) {
          } else {
            setTimeout(() => {
              if (this._isMounted) {
                this.setState({ isTimedOut: true });
              }
            }, 3000);
          }
        }
        break;
      case 32:
        event.stopPropagation();
        event.preventDefault();
        if (this._isMounted) {
          this.setState({ isTimedOut: false });
        }

        this.startVideo();
        if (this.state.pause !== true && this.state.cogOpen !== true) {
          if (this.state.pause === false && this.state.play === false) {
          } else {
            setTimeout(() => {
              if (this._isMounted) {
                this.setState({ isTimedOut: true });
              }
            }, 3000);
          }
        }
        break;
      case 75:
        event.stopPropagation();
        event.preventDefault();
        if (this._isMounted) {
          this.setState({ isTimedOut: false });
        }

        this.startVideo();
        if (this.state.pause !== true && this.state.cogOpen !== true) {
          if (this.state.pause === false && this.state.play === false) {
          } else {
            setTimeout(() => {
              if (this._isMounted) {
                this.setState({ isTimedOut: true });
              }
            }, 3000);
          }
        }
        break;
      case 37:
        event.stopPropagation();
        event.preventDefault();
        if (this._isMounted) {
          this.setState({
            pause: true,
            play: false,
            isTimedOut: false,
          });
        }

        if (player.currentTime < 5 && this._isMounted) {
          player.currentTime = 0;
          this.setState({
            videoPlayed: 0,
            videoPlayedPercent: 0,
          });
        } else {
          player.currentTime = this.state.videoPlayed - 5;
          if (this._isMounted) {
            this.setState({
              videoPlayed: player.currentTime,
              videoPlayedPercent:
                (player.currentTime / this.state.videoDuration) * 100,
            });
          }
        }
        if (this._isMounted) {
          this.setState({
            pause: false,
            play: true,
          });
        }

        if (this.state.pause !== true && this.state.cogOpen !== true) {
          if (this.state.pause === false && this.state.play === false) {
          } else {
            setTimeout(() => {
              if (this._isMounted) {
                this.setState({ isTimedOut: true });
              }
            }, 3000);
          }
        }
        break;
      case 74:
        event.stopPropagation();
        event.preventDefault();
        if (this._isMounted) {
          this.setState({
            pause: true,
            play: false,
            isTimedOut: false,
          });
        }

        if (player.currentTime < 10 && this._isMounted) {
          player.currentTime = 0;
          this.setState({
            videoPlayed: 0,
            videoPlayedPercent: 0,
          });
        } else {
          player.currentTime = this.state.videoPlayed - 10;
          if (this._isMounted) {
            this.setState({
              videoPlayed: player.currentTime,
              videoPlayedPercent:
                (player.currentTime / this.state.videoDuration) * 100,
            });
          }
        }
        if (this._isMounted) {
          this.setState({
            pause: false,
            play: true,
          });
        }

        if (this.state.pause !== true && this.state.cogOpen !== true) {
          if (this.state.pause === false && this.state.play === false) {
          } else {
            setTimeout(() => {
              if (this._isMounted) {
                this.setState({ isTimedOut: true });
              }
            }, 3000);
          }
        }
        break;
      case 39:
        event.stopPropagation();
        event.preventDefault();
        if (this._isMounted) {
          this.setState({
            pause: true,
            play: false,
            isTimedOut: false,
          });
        }

        if (player.currentTime + 5 > this.state.videoDuration) {
          player.currentTime = this.state.videoDuration;
          if (this._isMounted) {
            this.setState({
              videoPlayed: this.state.videoDuration,
              videoPlayedPercent: 100,
            });
          }
        } else {
          player.currentTime = this.state.videoPlayed + 5;
          if (this._isMounted) {
            this.setState({
              videoPlayed: player.currentTime,
              videoPlayedPercent:
                (player.currentTime / this.state.videoDuration) * 100,
            });
          }
        }
        if (this._isMounted) {
          this.setState({
            pause: false,
            play: true,
          });
        }

        if (this.state.pause !== true && this.state.cogOpen !== true) {
          if (this.state.pause === false && this.state.play === false) {
          } else {
            setTimeout(() => {
              if (this._isMounted) {
                this.setState({ isTimedOut: true });
              }
            }, 3000);
          }
        }
        break;
      case 76:
        event.stopPropagation();
        event.preventDefault();
        if (this._isMounted) {
          this.setState({
            pause: true,
            play: false,
            isTimedOut: false,
          });
        }

        if (player.currentTime + 10 > this.state.videoDuration) {
          player.currentTime = this.state.videoDuration;
          if (this._isMounted) {
            this.setState({
              videoPlayed: this.state.videoDuration,
              videoPlayedPercent: 100,
            });
          }
        } else {
          player.currentTime = this.state.videoPlayed + 10;
          if (this._isMounted) {
            this.setState({
              videoPlayed: player.currentTime,
              videoPlayedPercent:
                (player.currentTime / this.state.videoDuration) * 100,
            });
          }
        }
        if (this._isMounted) {
          this.setState({
            pause: false,
            play: true,
          });
        }

        if (this.state.pause !== true && this.state.cogOpen !== true) {
          if (this.state.pause === false && this.state.play === false) {
          } else {
            setTimeout(() => {
              if (this._isMounted) {
                this.setState({ isTimedOut: true });
              }
            }, 3000);
          }
        }
        break;

      case 48:
        event.stopPropagation();
        event.preventDefault();
        player.currentTime = 0;
        if (this._isMounted) {
          this.setState({
            videoPlayed: 0,
            videoPlayedPercent: 0,
            play: true,
            pause: false,
            isTimedOut: false,
          });
        }

        if (this.state.pause !== true && this.state.cogOpen !== true) {
          if (this.state.pause === false && this.state.play === false) {
          } else {
            setTimeout(() => {
              if (this._isMounted) {
                this.setState({ isTimedOut: true });
              }
            }, 3000);
          }
        }
        break;
      case 36:
        event.stopPropagation();
        event.preventDefault();
        player.currentTime = 0;
        if (this._isMounted) {
          this.setState({
            videoPlayed: 0,
            videoPlayedPercent: 0,
            isTimedOut: false,
          });
        }

        if (this.state.pause === false && this.state.play === false) {
          if (this._isMounted) {
            this.setState({
              play: true,
            });
          }
        }
        if (this.state.pause !== true && this.state.cogOpen !== true) {
          if (this.state.pause === false && this.state.play === false) {
          } else {
            setTimeout(() => {
              if (this._isMounted) {
                this.setState({ isTimedOut: true });
              }
            }, 3000);
          }
        }
        break;
      case 35:
        event.stopPropagation();
        event.preventDefault();
        player.currentTime = this.state.videoDuration;
        if (this._isMounted) {
          this.setState({
            videoPlayed: this.state.videoDuration,
            videoPlayedPercent: 100,
            pause: false,
            play: false,
            isTimedOut: false,
          });
        }

        if (this.state.pause !== true && this.state.cogOpen !== true) {
          if (this.state.pause === false && this.state.play === false) {
          } else {
            setTimeout(() => {
              if (this._isMounted) {
                this.setState({ isTimedOut: true });
              }
            }, 3000);
          }
        }
        break;
      case 38:
        event.stopPropagation();
        event.preventDefault();
        localStorage.setItem("prevVolumeLevel", this.state.volumeLevel);
        if (JSON.parse(this.state.volumeLevel) + 0.05 > 1) {
          if (this._isMounted) {
            this.setState({
              volumeLevel: 1,
              muted: false,
              isTimedOut: false,
            });
          }

          localStorage.setItem("muted", "false");
          localStorage.setItem("volumeLevel", "1");
        } else {
          if (this._isMounted) {
            this.setState({
              volumeLevel: JSON.stringify(
                JSON.parse(this.state.volumeLevel) + 0.05
              ),
            });
          }

          if (this.state.volumeLevel > 0) {
            if (this._isMounted) {
              this.setState({
                muted: false,
              });
            }
          } else if (this.state.volumeLevel === 0) {
            if (this._isMounted) {
              this.setState({
                muted: true,
              });
            }

            localStorage.setItem("muted", "true");
          }
          localStorage.setItem("volumeLevel", this.state.volumeLevel);
        }
        if (this.state.pause !== true && this.state.cogOpen !== true) {
          if (this.state.pause === false && this.state.play === false) {
          } else {
            setTimeout(() => {
              if (this._isMounted) {
                this.setState({ isTimedOut: true });
              }
            }, 3000);
          }
        }
        break;
      case 40:
        event.stopPropagation();
        event.preventDefault();
        if (JSON.parse(this.state.volumeLevel) - 0.05 < 0) {
          if (this._isMounted) {
            this.setState({
              volumeLevel: 0,
              muted: true,
              isTimedOut: false,
            });
          }

          localStorage.setItem("muted", "true");
          localStorage.setItem("volumeLevel", "0");
        } else {
          if (this._isMounted) {
            this.setState({
              volumeLevel: JSON.stringify(
                JSON.parse(this.state.volumeLevel) - 0.05
              ),
            });
          }

          if (this.state.volumeLevel > 0) {
            if (this._isMounted) {
              this.setState({
                muted: false,
              });
            }
          } else if (this.state.volumeLevel === 0) {
            if (this._isMounted) {
              this.setState({
                muted: true,
              });
            }

            localStorage.setItem("muted", "true");
          }
          localStorage.setItem("volumeLevel", this.state.volumeLevel);
        }
        if (this.state.pause !== true && this.state.cogOpen !== true) {
          if (this.state.pause === false && this.state.play === false) {
          } else {
            setTimeout(() => {
              if (this._isMounted) {
                this.setState({ isTimedOut: true });
              }
            }, 3000);
          }
        }
        break;
      case 77:
        event.stopPropagation();
        event.preventDefault();
        if (this._isMounted) {
          this.setState({ isTimedOut: false });
        }

        if (this.state.muted === true) {
          if (this._isMounted) {
            this.setState({
              muted: false,
            });
          }

          localStorage.setItem("muted", "false");
        } else if (this.state.muted === false) {
          if (this._isMounted) {
            this.setState({
              muted: true,
            });
          }

          localStorage.setItem("muted", "true");
        }
        if (this.state.pause !== true && this.state.cogOpen !== true) {
          if (this.state.pause === false && this.state.play === false) {
          } else {
            setTimeout(() => {
              if (this._isMounted) {
                this.setState({ isTimedOut: true });
              }
            }, 3000);
          }
        }
        break;
      case 190:
        event.stopPropagation();
        event.preventDefault();
        if (this._isMounted) {
          this.setState({ isTimedOut: false });
        }

        if (event.shiftKey) {
          if (this.state.playBackRate === 2) {
          } else {
            if (this._isMounted) {
              this.setState({
                playBackRate: this.state.playBackRate + 0.25,
              });
            }
          }
        }
        if (this.state.pause !== true && this.state.cogOpen !== true) {
          if (this.state.pause === false && this.state.play === false) {
          } else {
            setTimeout(() => {
              if (this._isMounted) {
                this.setState({ isTimedOut: true });
              }
            }, 3000);
          }
        }
        break;
      case 188:
        event.stopPropagation();
        event.preventDefault();
        if (this._isMounted) {
          this.setState({ isTimedOut: false });
        }

        if (event.shiftKey) {
          if (this.state.playBackRate === 0.25) {
          } else {
            if (this._isMounted) {
              this.setState({
                playBackRate: this.state.playBackRate - 0.25,
              });
            }
          }
        }
        if (this.state.pause !== true && this.state.cogOpen !== true) {
          if (this.state.pause === false && this.state.play === false) {
          } else {
            setTimeout(() => {
              if (this._isMounted) {
                this.setState({ isTimedOut: true });
              }
            }, 3000);
          }
        }
        break;
      case 73:
        event.stopPropagation();
        event.preventDefault();
        if (this._isMounted) {
          this.setState({
            pip: true,
            isTimedOut: false,
          });
        }

        if (this.state.pause !== true && this.state.cogOpen !== true) {
          if (this.state.pause === false && this.state.play === false) {
          } else {
            setTimeout(() => {
              if (this._isMounted) {
                this.setState({ isTimedOut: true });
              }
            }, 3000);
          }
        }

        break;
    }
  };
  handleReadyPlayer = () => {
    let player = this.player.getInternalPlayer();
    window.setInterval(() => {
      if (!player.paused) {
        if (Math.round(player.currentTime) < this.state.videoWatched) {
        } else if (Math.round(player.currentTime) > this.state.videoWatched) {
          if (this._isMounted) {
            this.setState({ videoWatched: this.state.videoWatched + 1 });
            this.sendView(player);
          }
        }
      } else if (!player.paused && this._isMounted) {
        if (this.state.replay === false && this._isMounted) {
          this.setState({ pause: true, play: false });
        }
      }
    }, 1000);
  };
  startVideo = () => {
    if (
      this.state.pause === true &&
      this.state.play === false &&
      this._isMounted
    ) {
      this.setState({
        pause: false,
        play: true,
      });
    } else if (
      this.state.pause === false &&
      this.state.play === true &&
      this._isMounted
    ) {
      this.setState({
        pause: true,
        play: false,
      });
    } else if (
      this.state.pause === false &&
      this.state.play === false &&
      this._isMounted
    ) {
      this.setState({
        play: true,
        videoPlayed: 0,
        videoPlayedPercent: 0,
      });
    }
  };

  handleClickOutside = (event) => {
    if (
      document.getElementsByClassName("settings-wrapper")[0] &&
      !document
        .getElementsByClassName("settings-wrapper")[0]
        .contains(event.target) &&
      this._isMounted
    ) {
      this.setState({
        cogOpen: false,
        qualityOpen: false,
        speedOpen: false,
      });
    }
  };

  updateProgress = (state) => {
    if (this.state.videoDuration === 0 && this._isMounted) {
      const videoPlayer = this.player.getInternalPlayer();
      this.setState({
        videoDuration: videoPlayer.duration,
      });
    }
    if (this._isMounted) {
      this.setState({
        videoPlayed: state.playedSeconds,
        videoLoaded: state.loadedSeconds,
        videoLoadedPercent:
          (state.loadedSeconds / this.state.videoDuration) * 100,
        videoPlayedPercent:
          (state.playedSeconds / this.state.videoDuration) * 100,
      });
    }
  };

  async sendView(player) {
    let watchTimeLimit = 0;
    if (this.state.videoDuration < 30) {
      watchTimeLimit = Math.floor(this.state.videoDuration);
    } else {
      watchTimeLimit = 30;
    }
    if (this.state.videoWatched == watchTimeLimit && this._isMounted) {
      clearInterval();
      await API.graphql(
        graphqlOperation(mutations.sendView, {
          id: this.props.videoID,
        })
      );
    }
  }

  handleSliderClick = (newValue) => {
    let player = this.player.getInternalPlayer();
    player.currentTime = newValue * this.state.videoDuration;
    let pos = 0;
    if (newValue > 0.5) {
      pos = 105 - newValue * 100;
    } else {
      pos = 85 - newValue * 100;
    }
    if (this._isMounted) {
      this.setState({
        showTime: true,
        hoveredTime: newValue * this.state.videoDuration,
        hoveredPos: pos,
        videoPlayed: newValue * this.state.videoDuration,
        videoPlayedPercent: newValue * 100,
      });
    }
  };

  handleSliderStart = (startValue) => {
    if (this._isMounted) {
      this.setState({
        play: false,
        pause: true,
        videoPlayed: startValue * this.state.videoDuration,
        videoPlayedPercent: startValue * 100,
      });
    }
  };

  handleSliderEnd = (endValue) => {
    if (this._isMounted) {
      this.setState({
        play: true,
        pause: false,
        videoPlayed: endValue * this.state.videoDuration,
        videoPlayedPercent: endValue * 100,
        showTime: false,
      });
    }

    if (this.player) {
      let player = this.player.getInternalPlayer();
      player.currentTime = this.state.videoPlayed;
    }
  };

  handleHover = (intent) => {
    let pos = 0;
    if (intent > 0.5) {
      pos = 105 - intent * 100;
    } else {
      pos = 85 - intent * 100;
    }
    if (this._isMounted) {
      this.setState({
        showTime: true,
        hoveredTime: intent * this.state.videoDuration,
        hoveredPos: pos,
      });
    }
  };

  handleEndHover = () => {
    if (this._isMounted) {
      this.setState({
        showTime: false,
      });
    }
  };

  ref = (player) => {
    this.player = player;
    this.props.playerRef(this.player);
  };

  handleSound = () => {
    if (this.state.muted === true) {
      localStorage.setItem("muted", "false");
      if (this.state.volumeLevel === 0 || this.state.volumeLevel === "0") {
        if (this._isMounted) {
          this.setState({
            muted: false,
            volumeLevel: this.state.prevVolumeLevel,
          });
        }
      } else {
        if (this._isMounted) {
          this.setState({
            muted: false,
          });
        }
      }
    } else if (this.state.muted === false && this._isMounted) {
      localStorage.setItem("muted", "true");
      this.setState({
        muted: true,
      });
    }
  };
  handleVolumeClick = (newValue) => {
    if (this._isMounted) {
      this.setState({
        volumeLevel: newValue,
      });
    }

    if (this.state.volumeLevel > 0) {
      if (this._isMounted) {
        this.setState({
          muted: false,
        });
      }
    } else if (this.state.volumeLevel === 0 && this._isMounted) {
      this.setState({
        muted: true,
      });
      localStorage.setItem("muted", "true");
    }
    localStorage.setItem("volumeLevel", newValue);
  };

  handleVolumeStart = (startValue) => {
    localStorage.setItem("prevVolumeLevel", startValue);
    if (this._isMounted) {
      this.setState({
        prevVolumeLevel: startValue,
      });
    }
  };

  handleVolumeEnd = (endValue) => {
    if (endValue === 0 && this._isMounted) {
      this.setState({
        muted: true,
        volumeLevel: 0,
      });
    } else {
      localStorage.setItem("prevVolumeLevel", endValue);
      if (this._isMounted) {
        this.setState({
          prevVolumeLevel: endValue,
        });
      }
    }
  };

  toggleFullScreen = () => {
    const player = document.getElementsByClassName("player-wrapper")[0];
    if (this.state.fullScreen === false && this._isMounted) {
      if (player.requestFullscreen) {
        player.requestFullscreen();
      } else if (player.mozRequestFullScreen) {
        /* Firefox */
        player.mozRequestFullScreen();
      } else if (player.webkitRequestFullscreen) {
        /* Chrome, Safari & Opera */
        player.webkitRequestFullscreen();
      } else if (player.msRequestFullscreen) {
        /* IE/Edge */
        player.msRequestFullscreen();
      }
      this.setState({
        fullScreen: true,
      });
    } else if (this.state.fullScreen === true && this._isMounted) {
      if (player.requestFullscreen) {
        document.exitFullscreen();
      } else if (player.mozRequestFullScreen) {
        /* Firefox */
        document.mozExitFullScreen();
      } else if (player.webkitRequestFullscreen) {
        /* Chrome, Safari & Opera */
        document.webkitExitFullscreen();
      } else if (player.msRequestFullscreen) {
        /* IE/Edge */
        document.msExitFullscreen();
      }
      this.setState({
        fullScreen: false,
      });
    }
  };

  handleSettings = () => {
    if (this.state.cogOpen === true && this._isMounted) {
      this.setState({
        cogOpen: false,
        qualityOpen: false,
        speedOpen: false,
      });
    } else {
      if (this._isMounted) {
        this.setState({ cogOpen: true }, () => {
          document.getElementsByClassName("settings-wrapper")[0].focus();
        });
      }
    }
  };
  addEvents() {
    this.wrapperRef.current.addEventListener(
      "keydown",
      this.handleVideoShortcuts
    );
  }

  removeEvents() {
    this.wrapperRef.current.removeEventListener(
      "keydown",
      this.handleVideoShortcuts
    );
  }

  handleMouseMoving = (e) => {
    if (this._isMounted) {
      this.setState({ isTimedOut: false });
    }

    if (this.state.isTimedOut) {
    } else if (
      !this.state.isTimedOut &&
      this.state.play === false &&
      this.state.pause === false
    ) {
    } else if (
      !this.state.isTimedOut &&
      this.state.play === true &&
      this.state.cogOpen === false
    ) {
      let timeout;
      (() => {
        clearTimeout(timeout); 
        timeout = setTimeout(() => {
          if (this._isMounted) {
            this.setState({ isTimedOut: true });
          }
        }, 3000);
      })();
    }
  };
  isMobile = () => {
    if (
      window.matchMedia("(max-width: 813px)").matches ||
      window.matchMedia("(max-width: 1025px) and (orientation: landscape)")
        .matches
    ) {
      return true;
    } else {
      return false;
    }
  };
  render() {
    return (
      <div
        ref={this.wrapperRef}
        className="player-wrapper"
        style={{ cursor: this.state.isTimedOut === true ? "none" : "" }}
        onClick={() => this.setState({ isTimedOut: false })}
      >
        {this.state.showTime && (
          <div
            className="video-time"
            style={{ right: `${this.state.hoveredPos}%` }}
          >
            <div className="frame-image">
              {this.state.thumbs.map((thumb) => {
                return this.state.hoveredTime >= thumb.start &&
                  this.state.hoveredTime < thumb.end ? (
                  <img
                    onError={() => {
                      this.replaceThumb(thumb.key, thumb.index);
                    }}
                    src={thumb.link}
                  ></img>
                ) : (
                  ""
                );
              })}
            </div>
            <FormattedTime numSeconds={this.state.hoveredTime} />
          </div>
        )}
        {this.isMobile() && (
          <div
            className={`video-overlay ${
              this.state.mobileVideoOverlay ? "video-overlay-active" : ""
            }`}
            onClick={() => this.setState({ mobileVideoOverlay: false })}
          >
            <div className="play-wrapper">
              <Button
                className="play-button-mobile"
                onClick={(e) => this.startVideo(e)}
              >
                {this.state.play === false && this.state.pause === true && (
                  <i className="fas fa-play"></i>
                )}
                {this.state.pause === false && this.state.play === true && (
                  <i className="fas fa-pause"></i>
                )}
                {this.state.pause === false && this.state.play === false && (
                  <i className="fas fa-redo"></i>
                )}
              </Button>
            </div>
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="time-slider-wrapper"
            >
              <div className="time-slider-pad">
                <div className="video-time-wrapper-mobile">
                  <FormattedTime numSeconds={this.state.videoPlayed} />/
                  <FormattedTime numSeconds={this.state.videoDuration} />
                </div>
                <Slider
                  className="player-bar-mobile"
                  direction={Direction.HORIZONTAL}
                  isEnabled
                  onIntent={(intent) => this.handleHover(intent)}
                  onIntentEnd={() => this.handleEndHover()}
                  onChange={(newValue) => this.handleSliderClick(newValue)}
                  onChangeStart={(startValue) =>
                    this.handleSliderStart(startValue)
                  }
                  onChangeEnd={(endValue) => this.handleSliderEnd(endValue)}
                >
                  <div
                    className="video-loaded-mobile"
                    style={{
                      width: `${this.state.videoLoadedPercent}%`,
                    }}
                  ></div>
                  <div className="video-played-wrapper">
                    <div
                      className="video-played-mobile"
                      style={{
                        width: `${this.state.videoPlayedPercent}%`,
                      }}
                    ></div>
                    <div className="slider-circle-mobile"></div>
                  </div>
                  <div className="video-duration"></div>
                </Slider>
              </div>
            </div>
          </div>
        )}
        <div className="player-container">
          <ReactPlayer
            ref={this.ref}
            playing={this.state.play}
            className="video-player"
            url={this.state.video}
            onClick={() => this.startVideo()}
            onReady={() => this.handleReadyPlayer()}
            onProgress={this.updateProgress}
            muted={this.state.muted}
            volume={this.state.volumeLevel}
            onMouseMove={this.handleMouseMoving}
            onMouseOver={this.checkIdle}
            controls={false}
            playsinline={true}
            onEnded={() =>
              this.setState({
                play: false,
                pause: false,
                replay: true,
                videoCurrentTime: 0,
              })
            }
            playbackRate={this.state.playBackRate}
            pip={this.state.pip}
            config={{
              file: {
                hlsOptions: {
                  startPosition: this.state.videoCurrentTime,
                },
              },
            }}
          />
          <div
            className={`player-controls ${
              this.state.isTimedOut === true ? "hide-player-controls" : ""
            }`}
            style={{
              opacity:
                (this.state.pause === false && this.state.play === false) ||
                this.state.pause === true ||
                this.state.cogOpen === true ||
                this.state.isTimedOut !== true
                  ? 1
                  : "",
            }}
            onMouseMove={() => this.setState({ isTimedOut: false })}
            onClick={() => this.setState({ isTimedOut: false })}
          >
            <Slider
              className="player-bar"
              direction={Direction.HORIZONTAL}
              isEnabled
              onIntent={(intent) => this.handleHover(intent)}
              onIntentEnd={() => this.handleEndHover()}
              onChange={(newValue) => this.handleSliderClick(newValue)}
              onChangeStart={(startValue) => this.handleSliderStart(startValue)}
              onChangeEnd={(endValue) => this.handleSliderEnd(endValue)}
            >
              <div
                className="video-loaded"
                style={{
                  width: `${this.state.videoLoadedPercent}%`,
                }}
              ></div>
              <div className="video-played-wrapper">
                <div
                  className="video-played"
                  style={{
                    width: `${this.state.videoPlayedPercent}%`,
                  }}
                ></div>
                <div className="slider-circle"></div>
              </div>
              <div className="video-duration"></div>
            </Slider>
            <div className="player-btns">
              <IconButton onClick={() => this.startVideo()}>
                {this.state.play === false && this.state.pause === true && (
                  <PlayArrow />
                )}
                {this.state.pause === false && this.state.play === true && (
                  <Pause />
                )}
                {this.state.pause === false && this.state.play === false && (
                  <Replay />
                )}
              </IconButton>
              <div className="volume-wrapper">
                <IconButton
                  className="volume-button"
                  onClick={() => this.handleSound()}
                >
                  {this.state.muted === false &&
                    this.state.volumeLevel > 0.5 && <VolumeUp />}
                  {this.state.muted === false &&
                    this.state.volumeLevel <= 0.5 && <VolumeDown />}
                  {this.state.muted === true && <VolumeOff />}
                </IconButton>
                <Slider
                  className="volume-bar"
                  direction={Direction.HORIZONTAL}
                  isEnabled
                  onChange={(newValue) => this.handleVolumeClick(newValue)}
                  onChangeStart={(startValue) =>
                    this.handleVolumeStart(startValue)
                  }
                  onChangeEnd={(endValue) => this.handleVolumeEnd(endValue)}
                >
                  <div className="volume-level-wrapper">
                    <div
                      className="volume-meter"
                      style={{
                        width: `${this.state.volumeLevel * 100}%`,
                      }}
                    ></div>
                    <div className="volume-circle"></div>
                  </div>
                </Slider>
              </div>
              <div className="video-time-wrapper">
                <FormattedTime numSeconds={this.state.videoPlayed} />/
                <FormattedTime numSeconds={this.state.videoDuration} />
              </div>
              <div className="right-side-wrapper">
                <div className="settings-wrapper">
                  {this.state.cogOpen === true && (
                    <span className="tooltiptext tooltip-cog">
                      {this.state.speedOpen === false &&
                        this.state.qualityOpen === false && (
                          <div className="cog-options-wrapper">
                            <div
                              className="cog-options"
                              onClick={() =>
                                this.setState({
                                  speedOpen: true,
                                  qualityOpen: false,
                                })
                              }
                            >
                              {`Hastighet`}
                              <div className="tooltip-prompt">
                                {this.state.playBackRate === 1
                                  ? "Normal"
                                  : this.state.playBackRate}
                                <i className="fas fa-chevron-right"></i>
                              </div>
                            </div>
                            <div
                              className="cog-options"
                              onClick={() =>
                                this.setState({
                                  speedOpen: false,
                                  qualityOpen: true,
                                })
                              }
                            >
                              {`Kvalite`}
                              <div className="tooltip-prompt">
                                {this.state.selectedQuality}
                                <i className="fas fa-chevron-right"></i>
                              </div>
                            </div>
                          </div>
                        )}
                      {this.state.speedOpen === false &&
                        this.state.qualityOpen === true && (
                          <div className="cog-options-wrapper">
                            <div
                              className="cog-options cog-header"
                              onClick={() =>
                                this.setState({ qualityOpen: false })
                              }
                            >
                              <i className="fas fa-chevron-left"></i>
                              <div className="cog-title">{`Kvalite`}</div>
                            </div>
                            {this.state.qualities.map((quality) => (
                              <div
                                className="cog-options"
                                onClick={() => {
                                  this.setState(
                                    {
                                      qualityOpen: false,
                                      selectedQuality: quality,
                                      videoCurrentTime: this.player.getCurrentTime(),
                                    },
                                    () => {
                                      this.setQuality();
                                    }
                                  );
                                }}
                              >
                                {this.state.selectedQuality === quality && (
                                  <i className="fas fa-check"></i>
                                )}
                                <div className="cog-title">{quality}</div>
                              </div>
                            ))}
                          </div>
                        )}
                      {this.state.speedOpen === true &&
                        this.state.qualityOpen === false && (
                          <div className="cog-options-wrapper">
                            <div
                              className="cog-options cog-header"
                              onClick={() =>
                                this.setState({ speedOpen: false })
                              }
                            >
                              <i className="fas fa-chevron-left"></i>
                              <div className="cog-title">{`Hastighet`}</div>
                            </div>
                            <div
                              className="cog-options"
                              onClick={() =>
                                this.setState({
                                  speedOpen: false,
                                  playBackRate: 0.25,
                                })
                              }
                            >
                              {this.state.playBackRate == 0.25 && (
                                <i className="fas fa-check"></i>
                              )}
                              <div className="cog-title">{`0.25`}</div>
                            </div>
                            <div
                              className="cog-options"
                              onClick={() =>
                                this.setState({
                                  speedOpen: false,
                                  playBackRate: 0.5,
                                })
                              }
                            >
                              {this.state.playBackRate == 0.5 && (
                                <i className="fas fa-check"></i>
                              )}
                              <div className="cog-title">{`0.5`}</div>
                            </div>
                            <div
                              className="cog-options"
                              onClick={() =>
                                this.setState({
                                  speedOpen: false,
                                  playBackRate: 0.75,
                                })
                              }
                            >
                              {this.state.playBackRate == 0.75 && (
                                <i className="fas fa-check"></i>
                              )}
                              <div className="cog-title">{`0.75`}</div>
                            </div>
                            <div
                              className="cog-options"
                              onClick={() =>
                                this.setState({
                                  speedOpen: false,
                                  playBackRate: 1,
                                })
                              }
                            >
                              {this.state.playBackRate == 1 && (
                                <i className="fas fa-check"></i>
                              )}
                              <div className="cog-title">{`Normal`}</div>
                            </div>
                            <div
                              className="cog-options"
                              onClick={() =>
                                this.setState({
                                  speedOpen: false,
                                  playBackRate: 1.25,
                                })
                              }
                            >
                              {this.state.playBackRate == 1.25 && (
                                <i className="fas fa-check"></i>
                              )}
                              <div className="cog-title">{`1.25`}</div>
                            </div>
                            <div
                              className="cog-options"
                              onClick={() =>
                                this.setState({
                                  speedOpen: false,
                                  playBackRate: 1.5,
                                })
                              }
                            >
                              {this.state.playBackRate == 1.5 && (
                                <i className="fas fa-check"></i>
                              )}
                              <div className="cog-title">{`1.5`}</div>
                            </div>
                            <div
                              className="cog-options"
                              onClick={() =>
                                this.setState({
                                  speedOpen: false,
                                  playBackRate: 1.75,
                                })
                              }
                            >
                              {this.state.playBackRate == 1.75 && (
                                <i className="fas fa-check"></i>
                              )}
                              <div className="cog-title">{`1.75`}</div>
                            </div>
                            <div
                              className="cog-options"
                              onClick={() =>
                                this.setState({
                                  speedOpen: false,
                                  playBackRate: 2,
                                })
                              }
                            >
                              {this.state.playBackRate == 2 && (
                                <i className="fas fa-check"></i>
                              )}
                              <div className="cog-title">{`2`}</div>
                            </div>
                          </div>
                        )}
                    </span>
                  )}
                  <IconButton onClick={this.handleSettings} id="cog-button">
                    <Settings
                      className={`tooltip ${
                        this.state.cogOpen === true ? "open-cog" : "closed-cog"
                      }`}
                    />
                  </IconButton>
                </div>
                <div className="pip-wrapper">
                  <Button onClick={() => this.setState({ pip: true })}>
                    <i style={{ color: "white" }} className="fas fa-clone"></i>
                  </Button>
                </div>
                <div className="fullScreen-wrapper">
                  <Button onClick={this.toggleFullScreen}>
                    {this.state.fullScreen === false ? (
                      <Fullscreen />
                    ) : (
                      <FullscreenExit />
                    )}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}
export default Player;
