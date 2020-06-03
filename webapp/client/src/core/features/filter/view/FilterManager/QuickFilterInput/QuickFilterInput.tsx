import { bind } from 'decko';
import * as React from 'react';

import {
  IFilterData,
  IQuickFilter,
  makeDefaultFilterDataFromQuickFilter,
} from 'core/features/filter/Model';
import ClickOutsideListener from 'core/shared/view/elements/ClickOutsideListener/ClickOutsideListener';
import { Icon } from 'core/shared/view/elements/Icon/Icon';
import TextInput from 'core/shared/view/elements/TextInput/TextInput';

import styles from './QuickFilterInput.module.css';
import QuickFilterItem from './QuickFilterItem/QuickFilterItem';

interface ILocalProps {
  isCollapsed: boolean;
  quickFilters: IQuickFilter[];
  isShowQuickFilters: boolean;
  onExpandSidebar(): void;
  onCreateFilter(filter: IFilterData): void;
  onHideFilters(): void;
}

interface ILocalState {
  value: string;
  selectedQuickFilter: IQuickFilter | null;
  isShownQuickFilters: boolean;
  isWasClickWhenCollapsed: boolean;
}

const initialState: ILocalState = {
  value: '',
  selectedQuickFilter: null,
  isShownQuickFilters: false,
  isWasClickWhenCollapsed: false,
};

class QuickFilterInput extends React.PureComponent<ILocalProps, ILocalState> {
  public state = initialState;
  private inputRef: HTMLInputElement | null = null;

  public componentDidMount() {
    if (this.props.isShowQuickFilters) {
      this.onShowQuickFilters();
    }
  }

  public componentDidUpdate(prevProps: ILocalProps) {
    if (!prevProps.isCollapsed && this.props.isCollapsed) {
      this.setState(initialState);
    }
  }

  public render() {
    const { value, selectedQuickFilter, isShownQuickFilters } = this.state;

    const iconType = 'search';

    return !this.props.isCollapsed ? (
      <ClickOutsideListener onClickOutside={this.onHideQuickFilters}>
        <div className={styles.root}>
          <TextInput
            value={value}
            placeholder="Search"
            leftContent={
              selectedQuickFilter ? (
                <div
                  className={styles.quickFilterTag}
                  data-test="selected-quick-filter"
                  onClick={this.onShowQuickFilters}
                >
                  {selectedQuickFilter.caption ||
                    selectedQuickFilter.propertyName}
                  <Icon
                    className={styles.quickFilterTag__remove}
                    type="close"
                    data-test="delete-selected-quick-filter-button"
                    onClick={this.onRemoveQuickFilter}
                  />
                </div>
              ) : (
                undefined
              )
            }
            size="medium"
            icon={iconType}
            dataTest="quick-filter-input"
            onKeyUp={this.onTextInputKeyUp}
            onChange={this.onChangeInputValue}
            onClick={this.onTextInputFocus}
            onInputRef={ref => (this.inputRef = ref)}
          />
          <Icon
            className={styles.hideFilters}
            type="close"
            onClick={this.props.onHideFilters}
          />
          {this.props.quickFilters.length > 0 && isShownQuickFilters && (
            <div className={styles.quickFilters} data-test="quick-filters">
              <div className={styles.quickFilter}>
                {this.props.quickFilters.map((filter, index) => (
                  <QuickFilterItem
                    key={index}
                    data={filter}
                    onSelect={this.onAddQuickFilter}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </ClickOutsideListener>
    ) : (
      <Icon
        type="search"
        className={styles.collapsedQuickFilterInput}
        dataTest="collapsed-quick-filter-icon"
        onClick={() => {
          this.setState({ isWasClickWhenCollapsed: true });
          this.props.onExpandSidebar();
        }}
      />
    );
  }

  @bind
  private onTextInputFocus() {
    this.setState({
      isShownQuickFilters: !Boolean(this.state.selectedQuickFilter),
    });
  }

  @bind
  private onTextInputKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      this.onCreateFilterFromQuickFilter();
    }
  }

  @bind
  private onChangeInputValue(value: string) {
    if (this.state.value || this.state.selectedQuickFilter) {
      this.setState({ value });
    }
  }

  @bind
  private onShowQuickFilters() {
    this.onInputFocus();
    this.setState({
      isShownQuickFilters: true,
      isWasClickWhenCollapsed: false,
    });
  }

  @bind
  private onAddQuickFilter(data: IQuickFilter) {
    this.onInputFocus();
    this.onHideQuickFilters();
    this.setState({
      selectedQuickFilter: data,
    });
  }

  @bind
  private onRemoveQuickFilter() {
    this.setState({
      selectedQuickFilter: null,
    });
    this.onInputFocus();
  }

  @bind
  private onHideQuickFilters() {
    this.setState({ isShownQuickFilters: false });
  }

  @bind
  private onCreateFilterFromQuickFilter() {
    if (!this.isDisabledCreatingFilter() && !this.props.isCollapsed) {
      const filter = makeDefaultFilterDataFromQuickFilter(
        this.state.selectedQuickFilter!,
        this.state.value
      );
      this.props.onCreateFilter(filter);
      this.inputRef!.blur();
      this.setState({
        value: '',
        isShownQuickFilters: false,
        selectedQuickFilter: null,
      });
    }
  }

  @bind
  private onInputFocus() {
    if (this.inputRef) {
      this.inputRef!.focus();
    }
  }

  @bind
  private isDisabledCreatingFilter() {
    return !this.state.selectedQuickFilter || !this.state.value;
  }
}

export type IQuickFilterInputLocalProps = ILocalProps;
export default QuickFilterInput;