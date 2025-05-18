/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { JSX, useCallback, useEffect, useRef, useState } from 'react';
import { CometChat } from '@cometchat/chat-sdk-javascript';
import unbanIconURL from '../../assets/close.svg';
import '../../styles/CometChatBannedMembers/CometChatBannedMembers.css';
import {
  CometChatButton,
  CometChatGroupEvents,
  CometChatList,
  CometChatListItem,
  CometChatUIKitLoginListener,
  IGroupMemberUnBanned,
  States,
  getLocalizedString,
} from '@cometchat/chat-uikit-react';

interface bannedMembersProp {
  group: CometChat.Group;
}
export const CometChatBannedMembers = (props: bannedMembersProp) => {
  const { group } = props;
  const [bannedMembers, setBannedMembers] = useState<CometChat.User[]>([]);
  const [state, setState] = useState<States>(States.loading);
  const bannedMembersRequestBuilderRef = useRef<any>({});

  useEffect(() => {
    const GUID = group.getGuid();
    const limit = 30;
    const bannedMembersRequest = new CometChat.BannedMembersRequestBuilder(GUID).setLimit(limit).build();

    bannedMembersRequest.fetchNext().then(
      (bannedMembers) => {
        setBannedMembers(bannedMembers);
      },
      (error) => {
        console.error('Banned Group Member list fetching failed with exception:', error);
      }
    );
  }, [group]);

  const unbanMember = useCallback(
    async (bannedMember: CometChat.User): Promise<void> => {
      try {
        CometChat.unbanGroupMember(group.getGuid(), bannedMember.getUid()).then(() => {
          const unbannedUser: IGroupMemberUnBanned = {
            unbannedUser: bannedMember,
            unbannedBy: CometChatUIKitLoginListener.getLoggedInUser()!,
            unbannedFrom: group,
          };
          CometChatGroupEvents.ccGroupMemberUnbanned.next(unbannedUser);
          setBannedMembers((prevState) => {
            const filteredMembers = prevState.filter((filterMember) => {
              return bannedMember.getUid() !== filterMember.getUid();
            });
            return filteredMembers;
          });
        });
      } catch (error) {
        console.log(error);
      }
    },
    [group]
  );

  function getDefaultListTailView(bannedMember: CometChat.User): JSX.Element | null {
    return (
      <CometChatButton
        iconURL={unbanIconURL}
        onClick={() => unbanMember(bannedMember)}
        hoverText={getLocalizedString('unban')}
      />
    );
  }

  /**
   * Creates default list item view
   */
  function getListItem(): (bannedMember: CometChat.User) => JSX.Element {
    return function (bannedMember: CometChat.User) {
      return (
        <CometChatListItem
          id={bannedMember.getUid()}
          title={bannedMember.getName()}
          avatarURL={bannedMember.getAvatar()}
          avatarName={bannedMember.getName()}
          trailingView={getDefaultListTailView(bannedMember)}
        />
      );
    };
  }

  const fetchNextAndAppendBannedMembers = useCallback(async (): Promise<void> => {
    try {
      setState(States.loading);
      if (Object.keys(bannedMembersRequestBuilderRef.current).length === 0) {
        const finalBannedMembersRequestBuilder = new CometChat.BannedMembersRequestBuilder(group.getGuid())
          .setLimit(30)
          .build();
        bannedMembersRequestBuilderRef.current = finalBannedMembersRequestBuilder;
      }
      const bannedMembersList = await bannedMembersRequestBuilderRef.current.fetchNext();
      if (bannedMembersList.length !== 0) {
        setBannedMembers((prevState) => {
          const list = [...prevState, ...bannedMembersList];
          const unique = list.filter((obj1, i, arr) => arr.findIndex((obj2) => obj2.uid === obj1.uid) === i);
          return unique;
        });
      }
      setState(States.loaded);
    } catch (error) {
      console.log(error);
      setState(States.error);
    }
  }, [group, bannedMembersRequestBuilderRef]);

  useEffect(
    /**
     * Creates a new request builder -> empties the `bannedMembers` state -> initiates a new fetch
     */
    () => {
      fetchNextAndAppendBannedMembers();
    },
    [fetchNextAndAppendBannedMembers, group]
  );

  const subscribeToEvents = useCallback(() => {
    const groupMemberBannedSub = CometChatGroupEvents.ccGroupMemberBanned.subscribe((item) => {
      const { kickedFrom, kickedUser } = item;
      if (kickedFrom.getGuid() === group.getGuid()) {
        setBannedMembers((prevState) => {
          return [...prevState, kickedUser];
        });
      }
    });
    const groupMemberUnbannedSub = CometChatGroupEvents.ccGroupMemberUnbanned.subscribe((item) => {
      const { unbannedFrom, unbannedUser } = item;
      if (unbannedFrom.getGuid() === group.getGuid()) {
        setBannedMembers((prevState) => {
          const filteredMembers = prevState.filter((filterMember) => {
            return unbannedUser.getUid() !== filterMember.getUid();
          });
          return filteredMembers;
        });
      }
    });

    return () => {
      groupMemberBannedSub.unsubscribe();
      groupMemberUnbannedSub.unsubscribe();
    };
  }, [group]);

  const attachSDKGroupListener = useCallback(() => {
    const listenerId = 'BannedMembers_GroupListener_' + String(Date.now());
    CometChat.addGroupListener(
      listenerId,
      new CometChat.GroupListener({
        onGroupMemberBanned: (
          message: CometChat.Action,
          kickedUser: CometChat.User,
          kickedBy: CometChat.User,
          kickedFrom: CometChat.Group
        ) => {
          if (group.getGuid() !== kickedFrom.getGuid()) {
            return;
          }
          CometChatGroupEvents.ccGroupMemberBanned.next({ message, kickedBy, kickedFrom, kickedUser });
        },
        onGroupMemberUnbanned: (
          message: CometChat.Action,
          unbannedUser: CometChat.User,
          unbannedBy: CometChat.User,
          unbannedFrom: CometChat.Group
        ) => {
          if (group.getGuid() !== unbannedFrom.getGuid()) {
            return;
          }
          CometChatGroupEvents.ccGroupMemberUnbanned.next({ message, unbannedBy, unbannedFrom, unbannedUser });
        },
      })
    );
    return () => CometChat.removeGroupListener(listenerId);
  }, [group]);

  useEffect(() => {
    const unsubscribeFromEvents = subscribeToEvents();
    const unsubscribeFromSDKEvents = attachSDKGroupListener();
    return () => {
      unsubscribeFromEvents();
      unsubscribeFromSDKEvents();
    };
  }, [subscribeToEvents, attachSDKGroupListener]);

  return (
    <div className="cometchat-banned-members">
      {state === States.loading ? (
        <div className="cometchat-banned-members__shimmer">
          {[...Array(3)].map((_, index) => (
            <div key={index} className="cometchat-banned-members__shimmer-item">
              <div className="cometchat-banned-members__shimmer-item-avatar"></div>
              <div className="cometchat-banned-members__shimmer-item-title"></div>
            </div>
          ))}
        </div>
      ) : (
        <>
          {bannedMembers.length === 0 ? (
            <div className="cometchat-banned-members__empty">
              <div className="cometchat-banned-members__empty-icon" />
              <div className="cometchat-banned-members__empty-text">{getLocalizedString('no_banned_members')}</div>
            </div>
          ) : (
            <CometChatList
              hideSearch={true}
              list={bannedMembers}
              listItemKey="getUid"
              itemView={getListItem()}
              showSectionHeader={false}
              onScrolledToBottom={() => fetchNextAndAppendBannedMembers()}
              state={bannedMembers.length === 0 ? States.loading : States.loaded}
            />
          )}
        </>
      )}
    </div>
  );
};
