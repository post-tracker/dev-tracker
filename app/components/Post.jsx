import React from 'react';
import TimeAgo from 'react-timeago';

const POST_CUTOFF_HEIGHT = 500;
const TIMESTAMP_UPDATE_INTERVAL = 1000;

const styles = {
    permalink: {
        float: 'right',
        lineHeight: '27px',
    },
    sourceIcon: {
        height: '20px',
        marginRight: '8px',
        position: 'relative',
        top: '4px',
        width: '20px',
    },
};

class Post extends React.Component {
    constructor ( props ) {
        super( props );

        this.expand = this.expand.bind( this );
        this.handleExpandClick = this.handleExpandClick.bind( this );

        this.state = {
            expandable: false,
        };
    }

    componentWillMount (){
        this.setState( {
            source: this.normaliseSource( this.props.postData.source );
        } );
    }

    componentDidMount () {
        const height = this.body.offsetHeight;

        if ( height > POST_CUTOFF_HEIGHT ) {
            // eslint-disable-next-line  react/no-did-mount-set-state
            this.setState( {
                expandable: true,
            } );
        }
    }

    getSectionURL () {
        const url = this.props.postData.url;

        if ( url.indexOf( 'steamcommunity.com' ) > -1 ) {
            const match = url.match( /(http[s]?:\/\/steamcommunity.com\/app\/\d+\/discussions\/\d+\/).+?/ );

            if ( match && match[ 1 ] ) {
                return match[ 1 ];
            }
        } else if ( url.indexOf( 'reddit.com' ) > -1 ) {
            const match = url.match( /(https:\/\/www\.reddit\.com\/r\/.+?)\/.+?/ );

            if ( match && match[ 1 ] ) {
                return match[ 1 ];
            }
        }

        return false;
    }

    handleExpandClick () {
        this.expand();
    }

    expand () {
        this.setState( {
            expandable: false,
        } );
    }

    normaliseSource ( originalSource ) {
        let source;

        /* eslint-disable indent */
        switch ( originalSource ) {
            case 'MiggyRSS':
                source = 'RSS';
                break;
            case 'LudeonForums':
                source = 'comments';
                break;
            case 'PUBGForums':
                source = 'comments';
                break;
            case 'SurviveTheArk':
                source = 'comments';
                break;
            default:
                source = originalSource;
                break;
        }

        /* eslint-enable indent */

        return source.toLowerCase();
    }

    getSectionIcon () {
        const sectionURL = this.getSectionURL();

        if ( sectionURL ) {
            return (
                <a
                    href = { sectionURL }
                >
                    <svg
                        className = { 'icon' }
                        style = { styles.sourceIcon }
                    >
                        <use
                            xlinkHref = { `#icon-${ this.state.source }` }
                        />
                    </svg>
                </a>
            );
        }

        return (
            <svg
                className = { 'icon' }
                style = { styles.sourceIcon }
            >
                <use
                    xlinkHref = { `#icon-${ this.state.source }` }
                />
            </svg>
        );
    }

    render () {
        let expander;
        let bodyClasses = 'panel-body';
        let title;
        let postedString = '';
        let topicLinkNode = false;

        if ( this.state.expandable ) {
            expander = (
                <div
                    className = { 'expander' }
                    onClick = { this.handleExpandClick }
                >
                    <button
                        className = { 'btn btn-default' }
                    >
                        { 'Show full post' }
                    </button>
                </div>
            );

            bodyClasses = `${ bodyClasses } expandable`;
        }

        if ( this.props.postData.role || this.props.postData.group ) {
            title = '[ ';

            if ( this.props.postData.role ) {
                title = `${ title }${ this.props.postData.role }`;
            }

            if ( this.props.postData.group ) {
                // eslint-disable-next-line no-magic-numbers
                if ( title.length > 2 ) {
                    title = `${ title } - `;
                }

                title = `${ title }${ this.props.postData.group }`;
            }

            title = `${ title } ]`;

            // If we have roles that are the same as the nick, don't display anything
            if ( !this.props.postData.group && this.props.postData.role === this.props.postData.nick ) {
                title = '';
            } else if ( !this.props.postData.role && this.props.postData.group === this.props.postData.nick ) {
                title = '';
            }
        }

        if ( title ) {
            postedString = ` ${ title } `;
        }

        if ( this.props.postData.topic_url ) {
            postedString = `${ postedString } posted in `;
            topicLinkNode = (
                <a
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML = { {
                        __html: this.props.postData.topic,
                    } }
                    href = { this.props.postData.topic_url } // eslint-disable-line camelcase
                />
            );
        } else {
            postedString = `${ postedString } ${ this.props.postData.topic }`;
        }

        return (
            <div
                className = { 'panel panel-default' }
            >
                <div
                    className = { 'panel-heading' }
                >
                    <span
                        title = { this.props.postData.name }
                    >
                        { this.props.postData.nick }
                    </span>
                    { postedString }
                    { topicLinkNode }
                </div>
                <div
                    className = { bodyClasses }
                    // eslint-disable-next-line react/no-danger
                    dangerouslySetInnerHTML = { {
                        __html: this.props.postData.content,
                    } }
                    // eslint-disable-next-line react/jsx-no-bind
                    ref = { ( node ) => {
                        this.body = node;
                    } }
                />
                { expander }
                <div
                    className = { 'panel-footer' }
                >
                    { this.getSectionIcon() }
                    <a
                        href = { this.props.postData.url }
                    >
                        <TimeAgo
                            date = { Number( this.props.postData.timestamp ) * TIMESTAMP_UPDATE_INTERVAL }
                        />
                    </a>
                    <a
                        href = { `?post=${ this.props.postData.id }` }
                        style = {
                            styles.permalink
                        }
                    >
                        { 'Direct link' }
                    </a>
                </div>
            </div>
        );
    }
}

Post.propTypes = {
    postData: React.PropTypes.shape( {
        content: React.PropTypes.string,
        group: React.PropTypes.string,
        id: React.PropTypes.string,
        name: React.PropTypes.string,
        nick: React.PropTypes.string,
        role: React.PropTypes.string,
        source: React.PropTypes.string,
        timestamp: React.PropTypes.string,
        topic: React.PropTypes.string,
        topic_url: React.PropTypes.string, // eslint-disable-line camelcase
        url: React.PropTypes.string,
    } ).isRequired,
};

export default Post;
