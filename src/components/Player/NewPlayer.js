import React, { useEffect,useState,useContext} from "react";
import Slider from '@react-native-community/slider';
import TrackPlayer from "react-native-track-player";
import { ACCENT } from "../../constants/colors";
import LinearGradientComp from "../Shared/LinearGradient";
import Controls from "./Controls";
import ImageColors from 'react-native-image-colors';
import TrackDetails from "./TrackDetails";
import { GlobalContext } from "../../context/GlobalState";
import { useTrackPlayerEvents, TrackPlayerEvents, STATE_PLAYING,useTrackPlayerProgress } from 'react-native-track-player';
import NewSeekBar from "./NewSeekBar";

TrackPlayer.updateOptions({
	capabilities: [
		TrackPlayer.CAPABILITY_PLAY,
            TrackPlayer.CAPABILITY_PAUSE,
            TrackPlayer.CAPABILITY_STOP,
            TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
            TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
			TrackPlayer.CAPABILITY_SEEK_TO,
        ],
        compactCapabilities: [
			TrackPlayer.CAPABILITY_PLAY,
            TrackPlayer.CAPABILITY_PAUSE,
			TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
            TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
			TrackPlayer.CAPABILITY_SEEK_TO,
        ],
    });
	
	const NewPlayer = (props) => {
		
		const {queue, updateQueue} = useContext(GlobalContext);
		
		// console.log(queue,"global queue");
		const {updateColor} = useContext(GlobalContext);
		
	const [paused, setPaused] = useState(true);
	const [currentPosition, setCurrentPosition] = useState(0);
	const [selectedTrack, setSelectedTrack] = useState(0);
	const [repeatOn, setRepeatOn] = useState(false);
	const [shuffleOn, setShuffleOn] = useState(false);
	const [color, setColor] = useState('');
	const [liked, setLiked] = useState(false);
 	const [skipping,setSkipping] = useState(false);
	const [sliderValue, setSliderValue] = useState(0);
	const [isSeeking, setIsSeeking] = useState(false); 
	const {position, duration} = useTrackPlayerProgress(250);

	// console.log(position," position",duration," duration");

    const setUpTrackPlayer =  () => {
		TrackPlayer.setupPlayer()
		.then((res) => {
		}).catch((err) => {
			console.log(err);
		})

		if(skipping){
			console.log("skipping");
			TrackPlayer.add({...props.tracks[selectedTrack],duration},null).then((res) => {
			}).catch((err) => {
				console.log(err);
			})
		}
		else {
			console.log("not skipping");
			TrackPlayer.add({...props.tracks[selectedTrack],duration}).then((res) => {
				console.log(res,"track curr");
			}).catch((err) => {
				console.log(err);
			})
		}
		// console.log("currentTrack added",track);
        
    }

    useEffect(() => {
        setUpTrackPlayer();
        return () => TrackPlayer.destroy();
    },[props])

    const track = props.tracks[selectedTrack];
    
	useEffect(() => {
		if (!isSeeking && position && duration) {
			setSliderValue(position / duration);
		}
	},[position, duration]);

	useEffect(() => {
		const getDominantColors = async () => {
			const colors = await ImageColors.getColors(track.artwork, {
				fallback: '#7f8c8d',
			});
			if (colors.platform === 'android') {
				averageColor = colors.average;
				setColor(averageColor);
				updateColor(averageColor);
			} else {
				const backgroundColor = colors.background;
				setColor(backgroundColor);
				updateColor(backgroundColor);
			}
			return averageColor;
		};
		getDominantColors();
	}, [track]);

	useEffect(() => {
		const getTrack = 
		() => {
			TrackPlayer.getQueue()
			.then((res) => {
				console.log(res,"queue from new");
			}).catch((err) => {
				console.log("error",err);
			})
			TrackPlayer.getCurrentTrack()
			.then((curr) => {
				console.log(curr,"current Track")
			}).catch((err) => {
				console.log(err);
			});
			// console.log(queue,"queue from new",getCurr,"get Curr");
		}
		getTrack();
	},[props,selectedTrack])

	const onBack = async () => {
		if (currentPosition < 10 && selectedTrack > 0) {
			setTimeout(() => {
				setPaused(false);
				setSkipping(true);
				setSelectedTrack((track) => track - 1);
			}, 0);
			await TrackPlayer.skipToPrevious();
		}
	};

	const onForward = async () => {
		if (selectedTrack < props.tracks.length - 1) {
			setTimeout(() => {
				setPaused(false);
				setSkipping(true);
				setSelectedTrack((track) => track + 1);
			}, 0);
			await TrackPlayer.skipToNext();
		}
	};

	const events = [
		TrackPlayerEvents.PLAYBACK_STATE,
		TrackPlayerEvents.PLAYBACK_ERROR
	];

	useTrackPlayerEvents(events, (event) => {
		if (event.type === TrackPlayerEvents.PLAYBACK_ERROR) {
			console.warn('An error occured while playing the current track.');
		}
		if (event.type === TrackPlayerEvents.PLAYBACK_STATE) {
			if(event.state === 2){
				setPaused(true);
			}
			else if(event.state === 3) {
				setPaused(false);
			}
		}
	});

	const slidingStarted = () => {
   		setIsSeeking(true);
 	};

 	//this function is called when the user stops sliding the seekbar
	const slidingCompleted = async value => {
		await TrackPlayer.seekTo(value * duration);
		setSliderValue(value);
		setIsSeeking(false);
	};

    return (
        <LinearGradientComp
			bgcolors={{
				colorOne: color ? color : '#7f8c8d',
				colorTwo: ACCENT,
			}}>
			<TrackDetails
				track_name={track.title}
				artist_name={track.artist}
				album_image={track.artwork}
			/>
			 <NewSeekBar
				onSlidingComplete={slidingCompleted}
				trackLength={duration}
				sliderValue={sliderValue}
				onSlidingStart={slidingStarted}
				currentPosition={position}
			/>
			<Controls
				onPressLike={() => setLiked((liked) => !liked)}
				liked={liked}
				onPressRepeat={() => setRepeatOn((repeatOn) => !repeatOn)}
				repeatOn={repeatOn}
				shuffleOn={shuffleOn}
				backwardDisabled={selectedTrack === 0}
				forwardDisabled={selectedTrack === props.tracks.length - 1}
				onPressShuffle={() => setShuffleOn((shuffleOn) => !shuffleOn)}
				onPressPlay={async () => {
					await TrackPlayer.play();
                    setPaused(false);
				}}
				onPressPause={async () => {
                    await TrackPlayer.pause();                    
                    setPaused(true);
                }}
				onBack={onBack}
				onForward={onForward}
				paused={paused}
			/>
		</LinearGradientComp>
    )
}

export default NewPlayer;