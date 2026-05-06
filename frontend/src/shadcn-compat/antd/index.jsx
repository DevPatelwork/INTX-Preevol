import { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import dayjs from 'dayjs';
import { cn } from '@/lib/utils';

function toPath(name) {
  if (Array.isArray(name)) return name;
  if (typeof name === 'number') return [name];
  if (typeof name === 'string') return name.split('.').filter(Boolean);
  return [];
}

function getIn(source, name) {
  const path = toPath(name);
  return path.reduce((acc, key) => (acc == null ? undefined : acc[key]), source);
}

function setIn(source, name, value) {
  const path = toPath(name);
  if (!path.length) return value;
  const root = Array.isArray(source) ? [...source] : { ...(source || {}) };
  let cursor = root;
  for (let i = 0; i < path.length - 1; i += 1) {
    const key = path[i];
    const next = cursor[key];
    cursor[key] = Array.isArray(next) ? [...next] : { ...(next || {}) };
    cursor = cursor[key];
  }
  cursor[path[path.length - 1]] = value;
  return root;
}

function deepMerge(target, source) {
  if (Array.isArray(source)) return [...source];
  if (!source || typeof source !== 'object') return source;
  const base = target && typeof target === 'object' && !Array.isArray(target) ? { ...target } : {};
  Object.keys(source).forEach((key) => {
    const next = source[key];
    if (next && typeof next === 'object' && !Array.isArray(next)) {
      base[key] = deepMerge(base[key], next);
    } else {
      base[key] = next;
    }
  });
  return base;
}

function isNil(v) {
  return v === undefined || v === null || v === '';
}

function createNotice(prefix) {
  return ({ message, description }) => {
    const title = message || prefix;
    const body = description ? `: ${description}` : '';
    // Keep behavior lightweight in browser and visible in logs.
    // eslint-disable-next-line no-console
    console.log(`[${prefix}] ${title}${body}`);
  };
}

export const message = {
  success: createNotice('Success'),
  error: createNotice('Error'),
  warning: createNotice('Warning'),
  info: createNotice('Info'),
  open: createNotice('Message'),
  destroy: () => {},
};

export const notification = {
  success: createNotice('Success'),
  error: createNotice('Error'),
  warning: createNotice('Warning'),
  info: createNotice('Info'),
  open: createNotice('Notification'),
  config: () => {},
  destroy: () => {},
};

const FormContext = /*#__PURE__*/ (() => {
  const { createContext } = require('react');
  return createContext(null);
})();

function createFormStore() {
  const listeners = new Set();
  let values = {};
  let onFinish = null;
  return {
    __setValues(next) {
      values = next || {};
      listeners.forEach((listener) => listener(values));
    },
    __setOnFinish(handler) {
      onFinish = handler;
    },
    __subscribe(listener) {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    getFieldValue(name) {
      return getIn(values, name);
    },
    getFieldsValue() {
      return values;
    },
    setFieldValue(name, value) {
      values = setIn(values, name, value);
      listeners.forEach((listener) => listener(values));
    },
    setFieldsValue(next) {
      values = deepMerge(values, next || {});
      listeners.forEach((listener) => listener(values));
    },
    setFields(fields = []) {
      let nextValues = values;
      fields.forEach((field) => {
        if (field?.name) nextValues = setIn(nextValues, field.name, field.value);
      });
      values = nextValues;
      listeners.forEach((listener) => listener(values));
    },
    resetFields() {
      values = {};
      listeners.forEach((listener) => listener(values));
    },
    submit() {
      if (typeof onFinish === 'function') onFinish(values);
    },
    validateFields() {
      return Promise.resolve(values);
    },
  };
}

function normalizeValue(args, valuePropName, getValueFromEvent) {
  if (typeof getValueFromEvent === 'function') return getValueFromEvent(...args);
  const first = args[0];
  if (first && first.target) {
    if (valuePropName === 'checked') return !!first.target.checked;
    return first.target.value;
  }
  if (args.length >= 2 && first && typeof first === 'object' && 'fileList' in first) {
    return first.fileList;
  }
  return first;
}

function FormComponent({
  children,
  form,
  onFinish,
  initialValues,
  layout = 'vertical',
  className,
  style,
  ...rest
}) {
  const localStore = useRef(createFormStore());
  const store = form || localStore.current;
  const [values, setValues] = useState(() => deepMerge({}, initialValues || {}));

  useEffect(() => {
    store.__setValues(values);
  }, [store, values]);

  useEffect(() => {
    if (!initialValues) return;
    setValues((prev) => deepMerge(prev, initialValues));
  }, [initialValues]);

  useEffect(() => {
    store.__setOnFinish(onFinish);
    return store.__subscribe((nextValues) => setValues(nextValues));
  }, [store, onFinish]);

  const contextValue = useMemo(
    () => ({ store, values, setValues, layout }),
    [store, values, layout]
  );

  const handleSubmit = (event) => {
    event.preventDefault();
    if (typeof onFinish === 'function') onFinish(values);
  };

  return (
    <FormContext.Provider value={contextValue}>
      <form className={className} style={style} onSubmit={handleSubmit} {...rest}>
        {children}
      </form>
    </FormContext.Provider>
  );
}

function FormItem({
  children,
  label,
  name,
  initialValue,
  valuePropName = 'value',
  getValueFromEvent,
  hidden,
  noStyle,
  required,
  style,
  className,
}) {
  const context = useContext(FormContext);
  if (!context) return children;

  const { values, setValues } = context;
  const hasName = name !== undefined && name !== null;
  const currentValue = hasName ? getIn(values, name) : undefined;

  useEffect(() => {
    if (!hasName || initialValue === undefined) return;
    if (currentValue !== undefined) return;
    setValues((prev) => setIn(prev, name, initialValue));
  }, [hasName, initialValue, currentValue, name, setValues]);

  const child = useMemo(() => {
    if (!hasName) return children;
    const validChild = Array.isArray(children)
      ? children.find(Boolean)
      : children;
    if (!validChild || typeof validChild !== 'object') return validChild;

    const nextProps = {
      [valuePropName]: currentValue ?? (valuePropName === 'checked' ? false : ''),
      onChange: (...args) => {
        const nextValue = normalizeValue(args, valuePropName, getValueFromEvent);
        setValues((prev) => setIn(prev, name, nextValue));
        if (typeof validChild.props?.onChange === 'function') validChild.props.onChange(...args);
      },
    };
    return { validChild, nextProps };
  }, [children, hasName, currentValue, valuePropName, getValueFromEvent, setValues, name]);

  if (hidden) return null;

  const content =
    child && child.validChild
      ? require('react').cloneElement(child.validChild, child.nextProps)
      : children;

  if (noStyle) return content;

  return (
    <div className={cn('mb-4', className)} style={style}>
      {label ? (
        <label className="mb-1 block text-sm font-medium text-[var(--on-surface)]">
          {label}
          {required ? <span className="ml-1 text-red-500">*</span> : null}
        </label>
      ) : null}
      {content}
    </div>
  );
}

function FormList({ name, initialValue = [], children }) {
  const context = useContext(FormContext);
  if (!context) return null;
  const { values, setValues } = context;
  const list = getIn(values, name);

  useEffect(() => {
    if (list === undefined) {
      setValues((prev) => setIn(prev, name, initialValue));
    }
  }, [list, initialValue, name, setValues]);

  const safeList = Array.isArray(list) ? list : [];
  const fields = safeList.map((_, index) => ({ key: index, name: index, fieldKey: index }));

  const add = (value = {}) => {
    setValues((prev) => {
      const current = getIn(prev, name);
      const arr = Array.isArray(current) ? [...current] : [];
      arr.push(value);
      return setIn(prev, name, arr);
    });
  };

  const remove = (index) => {
    setValues((prev) => {
      const current = getIn(prev, name);
      const arr = Array.isArray(current) ? [...current] : [];
      arr.splice(index, 1);
      return setIn(prev, name, arr);
    });
  };

  return children(fields, { add, remove });
}

function useForm() {
  const ref = useRef(null);
  if (!ref.current) ref.current = createFormStore();
  return [ref.current];
}

function useFormInstance() {
  return useContext(FormContext)?.store;
}

function useWatch(name, form) {
  const context = useContext(FormContext);
  const store = form || context?.store;
  const [value, setValue] = useState(() => store?.getFieldValue(name));

  useEffect(() => {
    if (!store) return undefined;
    setValue(store.getFieldValue(name));
    return store.__subscribe((nextValues) => {
      setValue(getIn(nextValues, name));
    });
  }, [store, JSON.stringify(toPath(name))]);

  return value;
}

FormComponent.Item = FormItem;
FormComponent.List = FormList;
FormComponent.useForm = useForm;
FormComponent.useFormInstance = useFormInstance;
FormComponent.useWatch = useWatch;

export const Form = FormComponent;

export function Input({ className, ...props }) {
  return (
    <input
      className={cn(
        'h-10 w-full rounded-md border border-[var(--outline)] bg-white px-3 text-sm outline-none',
        'focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-container)]',
        className
      )}
      {...props}
    />
  );
}

Input.Password = function InputPassword(props) {
  return <Input type="password" {...props} />;
};

Input.TextArea = function InputTextArea({ rows = 3, className, ...props }) {
  return (
    <textarea
      rows={rows}
      className={cn(
        'min-h-[88px] w-full rounded-md border border-[var(--outline)] bg-white px-3 py-2 text-sm outline-none',
        'focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-container)]',
        className
      )}
      {...props}
    />
  );
};

export function InputNumber({
  className,
  value,
  onChange,
  min,
  max,
  step = 1,
  readOnly,
  addonBefore,
  addonAfter,
  ...props
}) {
  const handleChange = (event) => {
    const raw = event.target.value;
    if (raw === '') {
      onChange?.(null);
      return;
    }
    const numeric = Number(raw);
    const bounded = Math.min(max ?? numeric, Math.max(min ?? numeric, numeric));
    onChange?.(Number.isFinite(bounded) ? bounded : null);
  };

  const input = (
    <input
      type="number"
      className={cn(
        'h-10 w-full rounded-md border border-[var(--outline)] bg-white px-3 text-sm outline-none',
        'focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-container)]',
        className
      )}
      value={isNil(value) ? '' : value}
      onChange={handleChange}
      min={min}
      max={max}
      step={step}
      readOnly={readOnly}
      {...props}
    />
  );

  if (!addonBefore && !addonAfter) return input;

  return (
    <div className="flex items-center">
      {addonBefore ? <span className="mr-2 text-sm text-[var(--on-surface-muted)]">{addonBefore}</span> : null}
      <div className="flex-1">{input}</div>
      {addonAfter ? <span className="ml-2 text-sm text-[var(--on-surface-muted)]">{addonAfter}</span> : null}
    </div>
  );
}

function SelectOption({ value, children }) {
  return <option value={value}>{children}</option>;
}

export function Select({
  options,
  children,
  value,
  onChange,
  mode,
  placeholder,
  className,
  ...props
}) {
  const isMultiple = mode === 'multiple' || mode === 'tags';
  const handleChange = (event) => {
    if (isMultiple) {
      const selected = Array.from(event.target.selectedOptions).map((option) => option.value);
      onChange?.(selected);
    } else {
      onChange?.(event.target.value);
    }
  };

  return (
    <select
      multiple={isMultiple}
      value={value ?? (isMultiple ? [] : '')}
      onChange={handleChange}
      className={cn(
        'h-10 w-full rounded-md border border-[var(--outline)] bg-white px-3 text-sm outline-none',
        'focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-container)]',
        className
      )}
      {...props}
    >
      {!isMultiple ? <option value="">{placeholder || 'Select'}</option> : null}
      {Array.isArray(options)
        ? options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label ?? option.value}
            </option>
          ))
        : children}
    </select>
  );
}

Select.Option = SelectOption;

export function Switch({ checked, onChange, disabled, checkedChildren, unCheckedChildren, ...props }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onChange?.(!checked)}
      className={cn(
        'inline-flex h-6 w-12 items-center rounded-full border transition',
        checked ? 'bg-[var(--primary)] border-[var(--primary)]' : 'bg-slate-300 border-slate-300',
        disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
      )}
      {...props}
    >
      <span
        className={cn(
          'inline-flex h-5 w-5 translate-x-0 items-center justify-center rounded-full bg-white text-[10px] transition',
          checked ? 'translate-x-6' : 'translate-x-0.5'
        )}
      >
        {checked ? checkedChildren : unCheckedChildren}
      </span>
    </button>
  );
}

export function Checkbox({ checked, onChange, children, ...props }) {
  return (
    <label className="inline-flex items-center gap-2 text-sm">
      <input type="checkbox" checked={!!checked} onChange={(e) => onChange?.(e)} {...props} />
      {children}
    </label>
  );
}

export function Button({
  children,
  icon,
  type = 'default',
  htmlType = 'button',
  block,
  className,
  ...props
}) {
  const variant =
    type === 'primary'
      ? 'bg-[var(--primary)] text-white border-[var(--primary)]'
      : type === 'dashed'
        ? 'border-dashed border-[var(--outline)] bg-white text-[var(--on-surface)]'
        : type === 'text'
          ? 'border-transparent bg-transparent text-[var(--on-surface)]'
          : 'border-[var(--outline)] bg-white text-[var(--on-surface)]';

  return (
    <button
      type={htmlType}
      className={cn(
        'inline-flex h-10 items-center justify-center gap-2 rounded-md border px-4 text-sm font-medium',
        variant,
        block ? 'w-full' : '',
        className
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  );
}

function LayoutBase({ children, className, style }) {
  return (
    <div className={cn('flex min-h-0 flex-col', className)} style={style}>
      {children}
    </div>
  );
}

function Sider({ children, className, width = 240, collapsedWidth = 72, collapsed, style }) {
  const effectiveWidth = collapsed ? collapsedWidth : width;
  return (
    <aside className={className} style={{ width: effectiveWidth, ...style }}>
      {children}
    </aside>
  );
}

function Header({ children, className, style }) {
  return (
    <header className={className} style={style}>
      {children}
    </header>
  );
}

function Content({ children, className, style }) {
  return (
    <main className={className} style={style}>
      {children}
    </main>
  );
}

function Footer({ children, className, style }) {
  return (
    <footer className={className} style={style}>
      {children}
    </footer>
  );
}

export const Layout = Object.assign(LayoutBase, { Sider, Header, Content, Footer });

function computeSpan(spanValue) {
  if (typeof spanValue === 'number') return spanValue;
  if (spanValue && typeof spanValue === 'object' && typeof spanValue.span === 'number') return spanValue.span;
  return 24;
}

export function Row({ children, gutter = 0, style, className, ...props }) {
  const horizontal = Array.isArray(gutter) ? gutter[0] : gutter;
  const vertical = Array.isArray(gutter) ? gutter[1] : gutter;
  return (
    <div
      className={cn('flex flex-wrap', className)}
      style={{
        marginLeft: horizontal ? -horizontal / 2 : 0,
        marginRight: horizontal ? -horizontal / 2 : 0,
        rowGap: vertical || 0,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function Col({ children, span = 24, offset = 0, style, className, ...props }) {
  const width = `${(computeSpan(span) / 24) * 100}%`;
  const left = `${(offset / 24) * 100}%`;
  return (
    <div
      className={cn(className)}
      style={{
        width,
        paddingLeft: 6,
        paddingRight: 6,
        marginLeft: offset ? left : undefined,
        ...style,
      }}
      {...props}
    >
      {children}
    </div>
  );
}

export function Divider({ orientation, dashed, children, style, className }) {
  if (children && orientation === 'left') {
    return (
      <div className={cn('my-3 flex items-center gap-2 text-sm font-semibold', className)} style={style}>
        <span>{children}</span>
        <hr className={cn('h-px flex-1 border-0 bg-[var(--outline)]', dashed ? 'border-dashed' : '')} />
      </div>
    );
  }
  return <hr className={cn('my-3 h-px border-0 bg-[var(--outline)]', className)} style={style} />;
}

export function Tag({ children, color, className, ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium',
        className
      )}
      style={{ backgroundColor: color || 'var(--surface-container-high)', borderColor: 'var(--outline)' }}
      {...props}
    >
      {children}
    </span>
  );
}

export function Space({ children, size = 8, direction = 'horizontal', className, style }) {
  return (
    <div
      className={cn(direction === 'vertical' ? 'flex flex-col' : 'flex items-center', className)}
      style={{ gap: size, ...style }}
    >
      {children}
    </div>
  );
}

export function Drawer({ open, visible, onClose, children, width = 300 }) {
  const isOpen = open ?? visible;
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/40" onClick={onClose}>
      <div
        className="h-full bg-white p-4 shadow-xl"
        style={{ width, maxWidth: '100%' }}
        onClick={(event) => event.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

function menuNodeFromItems(items = [], onClick) {
  return (
    <ul className="m-0 list-none p-0">
      {items.map((item) => (
        <li key={item.key} className="mb-1">
          <button
            type="button"
            className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left hover:bg-[var(--surface-container-high)]"
            onClick={() => onClick?.({ key: item.key, item })}
          >
            {item.icon}
            <span>{item.label}</span>
          </button>
          {Array.isArray(item.children) && item.children.length > 0 ? menuNodeFromItems(item.children, onClick) : null}
        </li>
      ))}
    </ul>
  );
}

export function Menu({ items = [], onClick, className }) {
  return <nav className={className}>{menuNodeFromItems(items, onClick)}</nav>;
}

export function Empty({ description = 'No data' }) {
  return <div className="rounded-md border border-dashed p-6 text-center text-sm text-[var(--on-surface-muted)]">{description}</div>;
}

export function Spin({ spinning = true, children, tip }) {
  if (!spinning) return children || null;
  return (
    <div className="flex items-center gap-2 text-sm text-[var(--on-surface-muted)]">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-[var(--outline)] border-t-[var(--primary)]" />
      {tip || 'Loading...'}
    </div>
  );
}

export function Result({ status, title, subTitle, extra }) {
  return (
    <div className="rounded-lg border border-[var(--outline)] bg-white p-6 text-center">
      <h3 className="text-lg font-semibold">{title || status}</h3>
      {subTitle ? <p className="mt-2 text-sm text-[var(--on-surface-muted)]">{subTitle}</p> : null}
      {extra ? <div className="mt-4">{extra}</div> : null}
    </div>
  );
}

export function Modal({ open, visible, onCancel, title, children, footer }) {
  const isOpen = open ?? visible;
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 bg-black/40 p-4" onClick={onCancel}>
      <div
        className="mx-auto mt-20 max-w-lg rounded-lg border border-[var(--outline)] bg-white p-5 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        {title ? <h3 className="mb-4 text-base font-semibold">{title}</h3> : null}
        <div>{children}</div>
        {footer !== null ? <div className="mt-4">{footer}</div> : null}
      </div>
    </div>
  );
}

Modal.confirm = ({ title, content, onOk }) => {
  const confirmed = window.confirm([title, content].filter(Boolean).join('\n'));
  if (confirmed) onOk?.();
};

Modal.error = ({ title, content }) => {
  window.alert([title, content].filter(Boolean).join('\n'));
};

export function Card({ title, extra, children, className, style }) {
  return (
    <section className={cn('rounded-lg border border-[var(--outline)] bg-white p-4', className)} style={style}>
      {(title || extra) && (
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-base font-semibold">{title}</h3>
          {extra}
        </div>
      )}
      {children}
    </section>
  );
}

function TypographyBase({ children, className, ...props }) {
  return (
    <span className={className} {...props}>
      {children}
    </span>
  );
}

TypographyBase.Title = function TypographyTitle({ level = 3, children, className, ...props }) {
  const TagName = `h${Math.min(Math.max(level, 1), 6)}`;
  return (
    <TagName className={cn('font-semibold', className)} {...props}>
      {children}
    </TagName>
  );
};

TypographyBase.Text = function TypographyText({ children, className, ...props }) {
  return (
    <span className={cn('text-sm', className)} {...props}>
      {children}
    </span>
  );
};

TypographyBase.Paragraph = function TypographyParagraph({ children, className, ...props }) {
  return (
    <p className={cn('text-sm', className)} {...props}>
      {children}
    </p>
  );
};

export const Typography = TypographyBase;

export function Badge({ count, children }) {
  return (
    <span className="relative inline-flex">
      {children}
      {count ? (
        <span className="absolute -right-2 -top-2 min-w-4 rounded-full bg-red-500 px-1 text-center text-[10px] text-white">
          {count}
        </span>
      ) : null}
    </span>
  );
}

export function Avatar({ src, children, size = 32 }) {
  return (
    <span
      className="inline-flex items-center justify-center overflow-hidden rounded-full bg-[var(--surface-container-high)]"
      style={{ width: size, height: size }}
    >
      {src ? <img src={src} alt="avatar" className="h-full w-full object-cover" /> : children}
    </span>
  );
}

export function Progress({ percent = 0 }) {
  return (
    <div className="h-2 w-full rounded-full bg-[var(--surface-container-high)]">
      <div className="h-full rounded-full bg-[var(--primary)]" style={{ width: `${Math.max(0, Math.min(100, percent))}%` }} />
    </div>
  );
}

function TabsPane({ children }) {
  return <>{children}</>;
}

export function Tabs({ items = [], children, defaultActiveKey, activeKey, onChange }) {
  const panes = items.length
    ? items
    : require('react').Children.toArray(children)
        .filter(Boolean)
        .map((child) => ({ key: child.key, label: child.props?.tab, children: child.props?.children }));
  const fallbackKey = panes[0]?.key;
  const [internalKey, setInternalKey] = useState(defaultActiveKey || fallbackKey);
  const key = activeKey ?? internalKey;
  const current = panes.find((pane) => String(pane.key) === String(key)) || panes[0];

  const change = (next) => {
    setInternalKey(next);
    onChange?.(next);
  };

  return (
    <div>
      <div className="mb-3 flex gap-2 border-b border-[var(--outline)]">
        {panes.map((pane) => (
          <button
            key={pane.key}
            type="button"
            className={cn(
              'border-b-2 px-3 py-2 text-sm',
              String(pane.key) === String(key) ? 'border-[var(--primary)] text-[var(--primary)]' : 'border-transparent'
            )}
            onClick={() => change(pane.key)}
          >
            {pane.label}
          </button>
        ))}
      </div>
      <div>{current?.children}</div>
    </div>
  );
}

Tabs.TabPane = TabsPane;

export function Radio({ checked, onChange, children, value, name }) {
  return (
    <label className="inline-flex items-center gap-2">
      <input
        type="radio"
        checked={!!checked}
        value={value}
        name={name}
        onChange={(event) => onChange?.(event)}
      />
      {children}
    </label>
  );
}

Radio.Group = function RadioGroup({ value, onChange, options = [] }) {
  return (
    <div className="flex flex-wrap gap-3">
      {options.map((option) => (
        <label key={option.value} className="inline-flex items-center gap-2">
          <input
            type="radio"
            name="radio-group"
            checked={String(value) === String(option.value)}
            onChange={() => onChange?.(option.value)}
          />
          {option.label}
        </label>
      ))}
    </div>
  );
};

export function Segmented({ options = [], value, onChange }) {
  return (
    <div className="inline-flex rounded-md border border-[var(--outline)] p-1">
      {options.map((option) => {
        const opt = typeof option === 'string' ? { label: option, value: option } : option;
        return (
          <button
            key={opt.value}
            type="button"
            className={cn(
              'rounded px-3 py-1 text-sm',
              String(opt.value) === String(value) ? 'bg-[var(--primary)] text-white' : 'text-[var(--on-surface)]'
            )}
            onClick={() => onChange?.(opt.value)}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
}

export function DatePicker({ value, onChange, format, className, ...props }) {
  const displayValue = value ? dayjs(value).format('YYYY-MM-DD') : '';
  return (
    <input
      type="date"
      value={displayValue}
      className={cn(
        'h-10 w-full rounded-md border border-[var(--outline)] bg-white px-3 text-sm outline-none',
        'focus:border-[var(--primary)] focus:ring-2 focus:ring-[var(--primary-container)]',
        className
      )}
      onChange={(event) => {
        const next = event.target.value ? dayjs(event.target.value, 'YYYY-MM-DD') : null;
        onChange?.(next, event.target.value, format);
      }}
      {...props}
    />
  );
}

DatePicker.RangePicker = function RangePicker({ value = [], onChange }) {
  const [start, end] = Array.isArray(value) ? value : [];
  return (
    <div className="grid grid-cols-2 gap-2">
      <DatePicker
        value={start}
        onChange={(next) => onChange?.([next, end])}
      />
      <DatePicker
        value={end}
        onChange={(next) => onChange?.([start, next])}
      />
    </div>
  );
};

export function AutoComplete({ value, onChange, options = [], placeholder }) {
  const datalistId = useMemo(() => `ac-${Math.random().toString(36).slice(2)}`, []);
  return (
    <>
      <input
        list={datalistId}
        value={value ?? ''}
        onChange={(event) => onChange?.(event.target.value)}
        placeholder={placeholder}
        className="h-10 w-full rounded-md border border-[var(--outline)] bg-white px-3 text-sm outline-none"
      />
      <datalist id={datalistId}>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </datalist>
    </>
  );
}

export function Descriptions({ items = [], children, column = 1 }) {
  const parsedItems = items.length
    ? items
    : require('react').Children.toArray(children)
        .filter(Boolean)
        .map((item) => ({ label: item.props?.label, children: item.props?.children }));

  return (
    <div
      className="grid gap-2"
      style={{ gridTemplateColumns: `repeat(${Math.max(1, column)}, minmax(0, 1fr))` }}
    >
      {parsedItems.map((item, index) => (
        <div key={`${item.label || 'row'}-${index}`} className="rounded border border-[var(--outline)] p-2">
          <div className="text-xs text-[var(--on-surface-muted)]">{item.label}</div>
          <div className="text-sm">{item.children}</div>
        </div>
      ))}
    </div>
  );
}

Descriptions.Item = function DescriptionsItem({ children }) {
  return <>{children}</>;
};

export function Statistic({ title, value, suffix, prefix }) {
  return (
    <div className="rounded border border-[var(--outline)] p-3">
      <div className="text-xs text-[var(--on-surface-muted)]">{title}</div>
      <div className="text-lg font-semibold">
        {prefix}
        {value}
        {suffix}
      </div>
    </div>
  );
}

export function Tooltip({ title, children }) {
  return <span title={typeof title === 'string' ? title : undefined}>{children}</span>;
}

export function Steps({ current = 0, items = [] }) {
  return (
    <div className="flex flex-wrap gap-2">
      {items.map((item, index) => (
        <div
          key={item.title || index}
          className={cn(
            'rounded-md border px-3 py-1 text-sm',
            index === current ? 'border-[var(--primary)] bg-[var(--primary-container)]' : 'border-[var(--outline)]'
          )}
        >
          {item.title}
        </div>
      ))}
    </div>
  );
}

export function Dropdown({ children }) {
  return <>{children}</>;
}

export function Table({ columns = [], dataSource = [], rowKey, className }) {
  const rows = Array.isArray(dataSource) ? dataSource : [];
  const keyGetter =
    typeof rowKey === 'function'
      ? rowKey
      : (record, index) => (typeof rowKey === 'string' ? record?.[rowKey] : record?._id || index);

  return (
    <div className={cn('overflow-auto rounded-md border border-[var(--outline)]', className)}>
      <table className="min-w-full text-sm">
        <thead className="bg-[var(--surface-container-high)]">
          <tr>
            {columns.map((column, idx) => (
              <th key={column.key || column.dataIndex || idx} className="border-b border-[var(--outline)] px-3 py-2 text-left">
                {column.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((record, rowIndex) => (
            <tr key={keyGetter(record, rowIndex)} className="border-b border-[var(--outline)] last:border-b-0">
              {columns.map((column, colIndex) => {
                const cellValue = column.dataIndex ? record?.[column.dataIndex] : undefined;
                const rendered =
                  typeof column.render === 'function'
                    ? column.render(cellValue, record, rowIndex)
                    : cellValue;
                return (
                  <td key={column.key || column.dataIndex || colIndex} className="px-3 py-2 align-top">
                    {rendered}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export const Grid = {
  useBreakpoint() {
    const calc = useCallback(() => {
      if (typeof window === 'undefined') return { xs: false, sm: false, md: true, lg: true, xl: false, xxl: false };
      const width = window.innerWidth;
      return {
        xs: width < 576,
        sm: width >= 576,
        md: width >= 768,
        lg: width >= 992,
        xl: width >= 1200,
        xxl: width >= 1400,
      };
    }, []);

    const [state, setState] = useState(calc);
    useEffect(() => {
      const listener = () => setState(calc());
      window.addEventListener('resize', listener);
      return () => window.removeEventListener('resize', listener);
    }, [calc]);
    return state;
  },
};

export function ConfigProvider({ children }) {
  return <>{children}</>;
}

function UploadComponent({ onChange, beforeUpload, multiple, children, ...props }) {
  const handleFile = (event) => {
    const files = Array.from(event.target.files || []);
    const fileList = files.map((file, index) => ({
      uid: `${Date.now()}-${index}`,
      name: file.name,
      status: 'done',
      originFileObj: file,
    }));
    const firstFile = fileList[0];
    if (firstFile?.originFileObj && typeof beforeUpload === 'function') {
      const keep = beforeUpload(firstFile.originFileObj);
      if (keep === false) return;
    }
    onChange?.({ file: firstFile, fileList });
  };

  return (
    <label className="inline-flex cursor-pointer items-center gap-2">
      <input type="file" className="hidden" onChange={handleFile} multiple={multiple} {...props} />
      {children || <Button>Upload</Button>}
    </label>
  );
}

UploadComponent.Dragger = UploadComponent;
export const Upload = UploadComponent;

export function App({ children }) {
  return <>{children}</>;
}

App.useApp = () => ({
  notification,
  message,
  modal: Modal,
});

export default {
  App,
  AutoComplete,
  Avatar,
  Badge,
  Button,
  Card,
  Checkbox,
  Col,
  ConfigProvider,
  DatePicker,
  Descriptions,
  Divider,
  Drawer,
  Dropdown,
  Empty,
  Form,
  Grid,
  Input,
  InputNumber,
  Layout,
  Menu,
  Modal,
  Progress,
  Radio,
  Result,
  Row,
  Segmented,
  Select,
  Space,
  Spin,
  Statistic,
  Steps,
  Switch,
  Table,
  Tabs,
  Tag,
  Tooltip,
  Typography,
  Upload,
  message,
  notification,
};
