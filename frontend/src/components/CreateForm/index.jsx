import { cloneElement, useEffect, useMemo, useState } from 'react';

import { useDispatch, useSelector } from 'react-redux';
import { crud } from '@/redux/crud/actions';
import { useCrudContext } from '@/context/crud';
import { selectCreatedItem } from '@/redux/crud/selectors';

import useLanguage from '@/locale/useLanguage';

import { Button, Form, Steps } from 'antd';
import Loading from '@/components/Loading';

export default function CreateForm({ config, formElements, withUpload = false }) {
  const STEP_THRESHOLD = 10;
  const STEP_SIZE = 8;
  let { entity } = config;
  const dispatch = useDispatch();
  const { isLoading, isSuccess } = useSelector(selectCreatedItem);
  const { crudContextAction } = useCrudContext();
  const { panel, collapsedBox, readBox } = crudContextAction;
  const [form] = Form.useForm();
  const [currentStep, setCurrentStep] = useState(0);
  const translate = useLanguage();

  const dynamicFields = formElements?.props?.fields;
  const visibleFieldKeys = useMemo(() => {
    if (!dynamicFields) return [];
    return Object.keys(dynamicFields).filter((key) => !dynamicFields[key]?.disableForForm);
  }, [dynamicFields]);

  const useStepForm = visibleFieldKeys.length > STEP_THRESHOLD;
  const stepGroups = useMemo(() => {
    if (!useStepForm) return [];
    const groups = [];
    for (let i = 0; i < visibleFieldKeys.length; i += STEP_SIZE) {
      groups.push(visibleFieldKeys.slice(i, i + STEP_SIZE));
    }
    return groups;
  }, [useStepForm, visibleFieldKeys]);

  const isLastStep = useStepForm && currentStep === stepGroups.length - 1;
  const currentStepFields = useStepForm ? stepGroups[currentStep] || [] : [];

  const renderedFormElements =
    useStepForm && dynamicFields
      ? cloneElement(formElements, { visibleFieldKeys: currentStepFields })
      : formElements;

  const onSubmit = (fieldsValue) => {
    // Manually trim values before submission

    if (fieldsValue.file && withUpload) {
      fieldsValue.file = fieldsValue.file[0].originFileObj;
    }

    // const trimmedValues = Object.keys(fieldsValue).reduce((acc, key) => {
    //   acc[key] = typeof fieldsValue[key] === 'string' ? fieldsValue[key].trim() : fieldsValue[key];
    //   return acc;
    // }, {});

    dispatch(crud.create({ entity, jsonData: fieldsValue, withUpload }));
  };

  useEffect(() => {
    if (isSuccess) {
      readBox.open();
      collapsedBox.open();
      panel.open();
      form.resetFields();
      setCurrentStep(0);
      dispatch(crud.resetAction({ actionType: 'create' }));
      dispatch(crud.list({ entity }));
    }
  }, [isSuccess]);

  const goToNextStep = async () => {
    await form.validateFields(currentStepFields);
    setCurrentStep((prev) => Math.min(prev + 1, stepGroups.length - 1));
  };

  return (
    <Loading isLoading={isLoading}>
      <Form form={form} layout="vertical" onFinish={onSubmit} className="erpFormWrapper">
        {useStepForm && (
          <Steps
            size="small"
            current={currentStep}
            items={stepGroups.map((_, index) => ({ title: `Step ${index + 1}` }))}
            style={{ marginBottom: 20 }}
          />
        )}
        {renderedFormElements}
        <Form.Item className="erpFormActions">
          {useStepForm && currentStep > 0 && (
            <Button onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}>
              {translate('Previous')}
            </Button>
          )}
          {useStepForm && !isLastStep && (
            <Button type="primary" onClick={goToNextStep}>
              {translate('Next')}
            </Button>
          )}
          {(!useStepForm || isLastStep) && (
            <Button type="primary" htmlType="submit" size="large">
              {translate('Submit')}
            </Button>
          )}
        </Form.Item>
      </Form>
    </Loading>
  );
}
