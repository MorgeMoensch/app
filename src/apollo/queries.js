import gql from 'graphql-tag'
import { graphql, compose } from 'react-apollo'

const getCurrentUrlQuery = gql`
  query GetCurrentUrl {
    url @client
  }
`

const getCurrentAudioQuery = gql`
  query GetCurrentAudio {
    audio @client {
      id
      url
      title
      sourcePath
      mediaId
    }
  }
`

const getCurrentMediaProgressQuery = gql`
  query GetCurrentMediaProgress($mediaId: ID!) {
    mediaProgress(mediaId: $mediaId) {
      id
      mediaId
      secs
      createdAt
      updatedAt
      __typename
    }
  }
`

const getPlaybackStateQuery = gql`
  query GetPlaybackState {
    playbackState @client
  }
`

const pendingAppSignInQuery = gql`
  query pendingAppSignIn {
    pendingAppSignIn {
      title
      body
      expiresAt
      verificationUrl
    }
  }
`

const withCurrentUrl = graphql(getCurrentUrlQuery, {
  props: ({ data: { url } }) => ({
    currentUrl: url
  })
})

const withAudio = graphql(getCurrentAudioQuery, {
  props: ({ data: { audio } }) => ({
    audio
  })
})

const withCurrentMediaProgress = graphql(getCurrentMediaProgressQuery, {
  options: ({audio}) => ({
    variables: {
      mediaId: audio.mediaId
    },
    fetchPolicy: 'network-only'
  }),
  skip: ({audio}) => !audio,
  props: ({ data: { mediaProgress } }) => ({
    mediaProgress: mediaProgress ? mediaProgress.secs : 0
  })
}) 

const withPlaybackState = graphql(getPlaybackStateQuery, {
  props: ({ data: { playbackState } }) => ({
    playbackState
  })
})

const withMe = graphql(gql`
  query me {
    user @client {
      id
    }
  }
`, {
  props: ({ data }) => {
    return {
      me: data.user
    }
  }
})

const pendingAppSignIn = compose(
  withMe,
  graphql(pendingAppSignInQuery, {
    skip: props => !props.me,
    options: {
      fetchPolicy: 'network-only'
    },
    props: ({ data }) => {
      return {
        pendingAppSignIn: data.pendingAppSignIn,
        refetchPendingSignInRequests: data.refetch
      }
    }
  })
)

export {
  withMe,
  withAudio,
  withPlaybackState,
  withCurrentUrl,
  pendingAppSignIn,
  withCurrentMediaProgress,
}
